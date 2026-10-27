---
title: "CTranslate2 Model Loader Heap Overflows"
vendor: "OpenNMT"
product: "CTranslate2"
class: "Heap buffer overflow (OOB read + OOB write)"
severity: "High"
status: "Disclosed"
date: 2026-07-01
cve: "CVE-2026-102566, CVE-2026-102567"
link: "https://github.com/OpenNMT/CTranslate2/pull/2068"
summary: "Two heap overflows in CTranslate2's model loader, both reachable by loading a crafted model file. A string field with no null terminator causes an out-of-bounds read. An unchecked tensor length causes an out-of-bounds write. Fixed in CTranslate2 4.8.1 (PR #2068)."
---

## Overview

CTranslate2 is OpenNMT's C++ inference engine for Transformer models. Its model loader has two heap overflows, and loading a crafted model file triggers both:

- **CVE-2026-102567:** an out-of-bounds read when a string field has no null terminator.
- **CVE-2026-102566:** an out-of-bounds write when a tensor's declared length is larger than its buffer.

The bugs affect versions earlier than 4.8.1. To fix them, upgrade to 4.8.1.

Both bugs come from one pattern. `Model::load` (`src/models/model.cc`) reads length fields from the file and uses them without checking them against the buffers they fill.

## Out-of-bounds read in string deserialization

`consume<std::string>` reads each string field in a model file, such as the spec name and each variable name:

```cpp
std::string consume(std::istream& in) {
  const auto str_length = consume<uint16_t>(in);
  const auto c_str = consume<char>(in, str_length);
  std::string str(c_str);
  delete [] c_str;
  return str;
}
```

The function works in three steps:

1. It reads a 16-bit length prefix, `str_length`.
2. It allocates `str_length` bytes and fills them from the file. Nothing guarantees that those bytes contain a null terminator.
3. It builds the string with `std::string(c_str)`. That constructor ignores `str_length` and calls `strlen` to find the end.

If the buffer has no null byte, `strlen` reads past the end of the allocation until it finds one elsewhere on the heap. The returned string can include heap memory that followed the buffer.

## Out-of-bounds write in variable loading

For each variable, `StorageView` allocates a buffer sized from the `shape` and `dtype` in the file. The loader then reads `num_bytes` bytes into that buffer, and `num_bytes` also comes from the file:

```cpp
StorageView variable(std::move(shape), dtype);
consume<char>(model_file, num_bytes, static_cast<char*>(variable.buffer()));
```

The loader never compares `num_bytes` with the buffer size. A file that declares a small `shape` and a large `num_bytes` writes past the end of the allocation. The file controls both the length and the contents of that write.

## Fix

CTranslate2 4.8.1 includes the fix from [PR #2068](https://github.com/OpenNMT/CTranslate2/pull/2068). The fix makes two changes:

- It passes `str_length` to the string constructor, so the string no longer depends on a null terminator.
- It rejects any variable whose payload size doesn't match its buffer.

```cpp
std::string str(c_str, str_length);
// ...
if (num_bytes != variable.size_in_bytes())
  throw std::runtime_error("Variable '" + name + "' has an invalid payload size");
```
