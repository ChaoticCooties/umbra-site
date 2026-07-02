---
title: "CTranslate2 Model Loader Heap Overflows"
vendor: "OpenNMT"
product: "CTranslate2"
class: "Heap buffer overflow (OOB read + OOB write)"
severity: "High"
status: "Disclosed"
date: 2026-07-01
identifier: "PR #2068"
link: "https://github.com/OpenNMT/CTranslate2/pull/2068"
summary: "Two heap overflows in CTranslate2's model loader: an out-of-bounds read from a string field with no null terminator, and an out-of-bounds write from a tensor length that is never checked against the buffer size. Both are reachable by loading a crafted model file. Fixed in PR #2068."
---

## Overview

CTranslate2 is OpenNMT's inference engine for Transformer models, written in C++. It loads models from a custom binary format, reading fields directly into heap buffers in `Model::load` (`src/models/model.cc`). Length fields in that format are taken from the file and used without validation against the buffers they fill.

## Out-of-bounds read in string deserialization

`consume<std::string>` reads the string fields in a model file: the spec name and each variable name.

```cpp
std::string consume(std::istream& in) {
  const auto str_length = consume<uint16_t>(in);
  const auto c_str = consume<char>(in, str_length);
  std::string str(c_str);
  delete [] c_str;
  return str;
}
```

`consume<uint16_t>` reads a 16-bit length prefix. `consume<char>(in, str_length)` allocates `new char[str_length]` and reads that many bytes from the file into it. Those bytes are not guaranteed to contain a null terminator.

`std::string(const char*)` calls `strlen` on its argument to determine the length, ignoring `str_length`. When the buffer has no null byte, `strlen` reads past the end of the allocation until it reaches one elsewhere on the heap. This is an out-of-bounds read, and the returned string can include heap memory that followed the buffer.

## Out-of-bounds write in variable loading

For each variable, the loader reads a length `num_bytes` from the file and reads that many bytes into the variable's buffer:

```cpp
StorageView variable(std::move(shape), dtype);
consume<char>(model_file, num_bytes, static_cast<char*>(variable.buffer()));
```

`variable` is allocated by `StorageView` from `shape` and `dtype`, which are also read from the file. `num_bytes` is never compared to the size of the buffer. A file that declares a small `shape` with a large `num_bytes` writes past the end of the allocation. The length of the write and its contents are both taken from the file.

## Fix

PR #2068 passes the known length to the string constructor and rejects a variable whose payload size does not match its buffer:

```cpp
std::string str(c_str, str_length);
// ...
if (num_bytes != variable.size_in_bytes())
  throw std::runtime_error("Variable '" + name + "' has an invalid payload size");
```
