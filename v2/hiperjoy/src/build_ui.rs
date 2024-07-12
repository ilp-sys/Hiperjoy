use gtk::prelude::*;
use gtk::{Application, ApplicationWindow, Button};

pub fn build_ui(app: &Application) {
    let button = Button::builder()
        .label("activate")
        .margin_top(12)
        .margin_bottom(12)
        .margin_start(12)
        .margin_end(12)
        .build();

    button.connect_clicked(|button| {
        button.set_label("Hello world");
    });

    let window = ApplicationWindow::builder()
        .application(app)
        .title("HIPERJOY")
        .child(&button)
        .build();

    window.present();
}
