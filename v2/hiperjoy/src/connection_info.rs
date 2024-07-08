pub struct ConnectionInfo(pub(crate) LEAP_CONNECTION_INFO);

impl ConnectionInfo {
    pub fn status(&self) -> ConnectionStatus {
        self.status.into()
    }
}
