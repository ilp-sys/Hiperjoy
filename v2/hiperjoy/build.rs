extern crate bindgen;

use std::env;
use std::path::PathBuf;

fn main() {
    println!("cargo:rustc-link-search=LeapSDK/lib");
    println!("cargo:rustc-link-search=LeapSDK/lib/x64");
    println!("cargo:rustc-link-search=LeapSDK/samples");

    if cfg!(target_os = "windows") {
        println!("cargo:rustc-link-lib=LeapC");
        println!("cargo:rustc-link-lib=exampleconnection");
    } else {
        println!("cargo:rustc-link-lib=LeapC");
        println!("cargo:rustc-link-lib=LeapC.6");
        println!("cargo:rustc-link-lib=exampleconnection");
    }

    println!("cargo:rerun-if-changed=LeapSDK/include/LeapC.h");
    println!("cargo:rerun-if-changed=LeapSDK/samples/ExampleConnection.h");
    
    let bindings = bindgen::Builder::default()
        .header("LeapSDK/include/LeapC.h")
        .header("LeapSDK/samples/ExampleConnection.h")
        .clang_arg(format!("-I{}", "LeapSDK/include"))
        .parse_callbacks(Box::new(bindgen::CargoCallbacks))
        .generate()
        .expect("Unable to generate bindings");

    let out_path = PathBuf::from(env::var("OUT_DIR").unwrap());
    bindings
        .write_to_file(out_path.join("bindings.rs"))
        .expect("Couldn't write bindings!");
}
