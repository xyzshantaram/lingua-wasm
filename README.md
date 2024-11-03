# lingua-wasm

Very specific build of lingua-rs exposing only one function for the most common
language detection usecase.

## Usage

This module has just one main export: the `LanguageDetector` class.

### Build instructions

Install [wasm-pack](https://github.com/rustwasm/wasm-pack) with
`cargo install wasm-pack` or any other method you prefer. Then, simply:

```
wasm-pack build
```

## License

Copyright &copy; 2024- Siddharth Singh <me@shantaram.xyz>,
[The MIT License](./LICENSE.md).
