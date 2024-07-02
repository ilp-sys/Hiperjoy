extern crate bindgen;

use std::env;
use std::path::PathBuf;

fn main() {
    println!("cargo:rustc-link-search=LeapSDK/lib");
    println!("cargo:rustc-link-lib=LeapC");
    println!("cargo:rustc-link-lib=LeapC.6");
    println!("cargo:rerun-if-changed=LeapSDK/include/LeapC.h");
    
    let bindings = bindgen::Builder::default()
        .header("LeapSDK/include/LeapC.h")
        .parse_callbacks(Box::new(bindgen::CargoCallbacks))
        .generate()
        .expect("Unable to generate bindings");

    let out_path = PathBuf::from(env::var("OUT_DIR").unwrap());
    bindings
        .write_to_file(out_path.join("bindings.rs"))
        .expect("Couldn't write bindings!");
}
