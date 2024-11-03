mod utils;

use lazy_static::lazy_static;
use lingua::{LanguageDetector, LanguageDetectorBuilder};
use wasm_bindgen::prelude::*;

lazy_static! {
    static ref DETECTOR: LanguageDetector = LanguageDetectorBuilder::from_all_languages()
        .with_preloaded_language_models()
        .build();
}

#[wasm_bindgen]
pub fn detect(s: &str) -> Option<String> {
    DETECTOR
        .detect_language_of(s)
        .map(|v| v.iso_code_639_3().to_string())
    /*     DETECTOR
        .compute_language_confidence_values(s)
        .into_iter()
        .map(|(language, confidence)| {
            (
                format!("{}", language.iso_code_639_3()),
                (confidence * 100.0).round(),
            )
        })
        .for_each(|(language, confidence)| {
            if confidence > t {
                m.set(
                    &JsValue::from_str(&language),
                    &JsValue::from_f64(confidence),
                );
            }
        });

    m */
}
