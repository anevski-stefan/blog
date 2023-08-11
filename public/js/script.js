document.addEventListener("DOMContentLoaded", () => {
  const timestampElements = document.querySelectorAll(".timestamp");

  timestampElements.forEach((element) => {
    const createdAt = dayjs(element.getAttribute("data-createdAt"));
    const now = dayjs();
    const timeDiff = now.diff(createdAt, "second");

    let timestampText = "";

    if (timeDiff < 60) {
      timestampText = `${timeDiff} seconds ago`;
    } else if (timeDiff < 3600) {
      const minutes = Math.floor(timeDiff / 60);
      timestampText = `${minutes} minutes ago`;
    } else if (timeDiff < 86400) {
      const hours = Math.floor(timeDiff / 3600);
      timestampText = `${hours} hours ago`;
    } else {
      const days = Math.floor(timeDiff / 86400);
      timestampText = `${days} days ago`;
    }

    element.textContent = timestampText;
  });

  // Update timestamps every 10 seconds
  setInterval(() => {
    timestampElements.forEach((element) => {
      const createdAt = dayjs(element.getAttribute("data-createdAt"));
      const now = dayjs();
      const timeDiff = now.diff(createdAt, "second");

      let timestampText = "";

      if (timeDiff < 60) {
        timestampText = `${timeDiff} seconds ago`;
      } else if (timeDiff < 3600) {
        const minutes = Math.floor(timeDiff / 60);
        timestampText = `${minutes} minutes ago`;
      } else if (timeDiff < 86400) {
        const hours = Math.floor(timeDiff / 3600);
        timestampText = `${hours} hours ago`;
      } else {
        const days = Math.floor(timeDiff / 86400);
        timestampText = `${days} days ago`;
      }

      element.textContent = timestampText;
    });
  }, 10000);
});
