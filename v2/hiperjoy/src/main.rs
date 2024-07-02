mod bindings {
    include!(concat!(env!("OUT_DIR"), "/bindings.rs"));
}

fn main() {
    println!("hello world");
//    unsafe {
//        bindings::OpenConnection();
//    }
}
