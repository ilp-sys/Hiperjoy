const fetchWrapper = async (xmlPayload: string) => {
  const url = "http://127.0.0.1:8000/xmlcommand";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
      },
      body: xmlPayload,
    });

    if (!response.ok) {
      const errmsg = `Request failed with statue ${response.status}`;
      console.error(errmsg);
      throw new Error(errmsg);
    }

    const contentType = response.headers.get("Content-Type");

    if (contentType && contentType.includes("image")) {
      const blob = await response.blob();
      return blob;
    } else {
      const responseText = await response.text();
      return responseText;
    }
  } catch (error) {
    throw error;
  }
};

const fetchHello = async () => {
  const url = "http://127.0.0.1:8000/hello";
  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (response.ok) {
      const responseText = await response.text();
      return responseText;
    } else {
      console.error("Failed to request:", response.statusText);
      throw new Error("Request failed");
    }
  } catch (error) {
    throw error;
  }
};

export { fetchWrapper, fetchHello };
