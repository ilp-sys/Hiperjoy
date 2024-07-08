use std::marker::PhantomData;

use derive_deref::Deref;
use leap_sys::LEAP_CONNECTION_MESSAGE;

use crate::event::EventRef;

#[derive(Deref, Clone, Copy)]
pub struct ConnectionMessage<'a>(
    pub(crate) LEAP_CONNECTION_MESSAGE,
    pub(crate) PhantomData<&'a ()>,
);

impl ConnectionMessage<'_> {
    pub fn event(&self) -> EventRef {
        (self.type_, &self.__bindgen_anon_1).into()
    }
}

