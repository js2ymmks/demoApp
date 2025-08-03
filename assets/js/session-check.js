    function validateSessionDataOrRedirect(key, redirectUrl) {
      const raw = sessionStorage.getItem(key);

      if (!raw) {
        window.location.href = redirectUrl;
        return null;
      }

      try {
        return JSON.parse(raw);
      } catch (e) {
        console.warn("Session data is invalid JSON:", e);
        window.location.href = redirectUrl;
        return null;
      }
    }
