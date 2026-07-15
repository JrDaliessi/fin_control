(() => {
  const storageKey = "fincontrol.theme";
  const allowedPreferences = ["light", "dark", "system"];
  const systemIsDark = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  let preference = "system";

  try {
    const storedPreference = window.localStorage.getItem(storageKey);
    if (allowedPreferences.includes(storedPreference)) {
      preference = storedPreference;
    }
  } catch {
    preference = "system";
  }

  const resolvedTheme =
    preference === "system"
      ? systemIsDark()
        ? "dark"
        : "light"
      : preference;

  if (resolvedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
})();
