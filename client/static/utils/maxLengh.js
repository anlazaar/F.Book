const inputs = [
  ...document.getElementsByTagName("textarea"),
  ...document.getElementsByTagName("input"),
];

console.log(inputs);
inputs.forEach((element) => {
  if (element.type === "file") return;

  element.addEventListener("input", function () {
    // Enforce max length manually
    if (element.maxLength > 0 && element.value.length > element.maxLength) {
      element.value = element.value.substring(0, element.maxLength); // Trim excess
    }

    console.log(element);
  });
});
