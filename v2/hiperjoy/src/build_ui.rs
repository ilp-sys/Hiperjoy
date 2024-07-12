use crate::leap_hand_sensor::leap_hand_sensor;
use gtk::prelude::*;
use gtk::{gio, Application, ApplicationWindow, Button};

pub fn build_ui(app: &Application) {
    let button = Button::builder()
        .label("activate")
        .margin_top(12)
        .margin_bottom(12)
        .margin_start(12)
        .margin_end(12)
        .build();

    button.connect_clicked(|button| {
        let current_label = button.label().expect("failed to get button label");
        if current_label == "activate" {
            button.set_label("deactivate");
            gio::spawn_blocking(move || {
                leap_hand_sensor();
            });
        } else {
            button.set_label("activate");
        }
    });

    let window = ApplicationWindow::builder()
        .application(app)
        .title("HIPERJOY")
        .child(&button)
        .build();

    window.present();
}
