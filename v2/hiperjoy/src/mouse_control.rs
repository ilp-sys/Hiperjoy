extern crate enigo;

use enigo::{
    Button,
    Direction::{Click, Press, Release},
    Enigo, Mouse, Settings,
    Axis,
    Coordinate,
};

pub struct MouseControl {
    controller: Enigo,
}

impl MouseControl {
    pub fn new() -> Self {
        MouseControl {
            controller: Enigo::new(&Settings::default()).unwrap(),
        }
    }

    pub fn move_mouse(&mut self, x: i32, y : i32, coordinate_type : Coordinate) {
        if let Err(e) = self.controller.move_mouse(x, y, coordinate_type) {
            eprintln!("Error moving mouse: {:?}", e);
        }
    }

    pub fn scroll_mouse(&mut self, vector : i32, direction : Axis) {
        if let Err(e) = self.controller.scroll(vector, direction) {
            eprintln!("Error scrolling mouse: {:?}", e);
        }

    }

    pub fn click_mouse(&mut self) {
        if let Err(e) = self.controller.button(Button::Left, Click) {
            eprintln!("Error clicking mouse: {:?}", e);
        }
    }
}
