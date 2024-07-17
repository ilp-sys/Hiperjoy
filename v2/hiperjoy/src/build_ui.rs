use crate::leap_hand_sensor::leap_hand_sensor;
use gtk::prelude::*;
use gtk::{
    gio, glib, Application, ApplicationWindow, Box as GtkBox, Button, Orientation, ScrolledWindow,
    TextView,
};
use std::sync::mpsc;
use std::time::Duration;

pub fn build_ui(app: &Application) {
    let button = Button::builder()
        .label("deactivate")
        .margin_top(12)
        .margin_bottom(12)
        .margin_start(12)
        .margin_end(12)
        .build();

    let log_panel = TextView::new();
    log_panel.set_editable(false);
    log_panel.set_cursor_visible(false);

    let scrolled_window = ScrolledWindow::builder()
        .child(&log_panel)
        .vexpand(true)
        .build();

    let vbox = GtkBox::new(Orientation::Vertical, 0);
    vbox.append(&scrolled_window);
    vbox.append(&button);

    let (tx, rx) = mpsc::channel();
    gio::spawn_blocking(move || {
        leap_hand_sensor(tx);
    });

    let log_panel_clone = log_panel.clone();
    glib::MainContext::default().spawn_local(async move {
        loop {
            while let Ok(log_message) = rx.try_recv() {
                let log_panel_clone_inner = log_panel_clone.clone();
                glib::MainContext::default().spawn_local(async move {
                    let buffer = log_panel_clone_inner.buffer();
                    buffer.insert_at_cursor(&log_message);
                    buffer.insert_at_cursor("\n");
                });
            }
            glib::timeout_future(Duration::from_millis(100)).await;
        }
    });

    let window = ApplicationWindow::builder()
        .application(app)
        .title("HIPERJOY")
        .child(&vbox)
        .default_width(600)
        .default_height(400)
        .build();

    window.present();
}
