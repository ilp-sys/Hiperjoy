use leap_sys::LEAP_CONNECTION_INFO;
use derive_deref::Deref;
use crate::connection_status::ConnectionStatus;

#[derive(Deref, Clone, Copy)]
pub struct ConnectionInfo(pub(crate) LEAP_CONNECTION_INFO);

impl ConnectionInfo {
    pub fn status(&self) -> ConnectionStatus {
        self.status.into()
    }
}
