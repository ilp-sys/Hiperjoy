use std::marker::PhantomData;

use derive_deref::Deref;
use leap_sys::LEAP_CONNECTION_MESSAGE;

use crate::event::EventRef;

#[doc = " Defines a basic message from the LeapC message queue."]
#[doc = " Set by calling LeapPollConnection()."]
#[doc = " @since 3.0.0"]
/// # Fields
/// Available via dereference: [LEAP_CONNECTION_MESSAGE].
#[derive(Deref, Clone, Copy)]
pub struct ConnectionMessage<'a>(
    pub(crate) LEAP_CONNECTION_MESSAGE,
    /// Holds a lifetime to invalidate previous messages
    pub(crate) PhantomData<&'a ()>,
);

impl ConnectionMessage<'_> {
    #[doc = " A pointer to the event data for the current type of message. @since 3.0.0"]
    pub fn event(&self) -> EventRef {
        (self.type_, &self.__bindgen_anon_1).into()
    }
}
