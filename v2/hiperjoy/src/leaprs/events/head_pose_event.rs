use derive_deref::Deref;
use leap_sys::LEAP_HEAD_POSE_EVENT;

use crate::{LeapVectorRef, QuaternionRef};

/// # Fields
/// Available via dereference: [LEAP_HEAD_POSE_EVENT].
#[derive(Deref, Clone, Copy)]
pub struct HeadPoseEventRef<'a>(pub(crate) &'a LEAP_HEAD_POSE_EVENT);

impl<'a> HeadPoseEventRef<'a> {
    #[doc = " The position and orientation of the user's head. Positional tracking must be enabled."]
    #[doc = " @since 4.1.0"]
    pub fn head_position(&self) -> LeapVectorRef {
        LeapVectorRef(&self.head_position)
    }

    pub fn head_orientation(&self) -> QuaternionRef {
        QuaternionRef(&self.head_orientation)
    }

    #[doc = " The linear and angular velocity of the user's head. Positional tracking must be enabled."]
    #[doc = " @since 4.1.0"]
    pub fn head_linear_velocity(&self) -> LeapVectorRef {
        LeapVectorRef(&self.head_linear_velocity)
    }

    pub fn head_angular_velocity(&self) -> LeapVectorRef {
        LeapVectorRef(&self.head_angular_velocity)
    }
}
