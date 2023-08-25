export function copyToClipboard({
  text,
  successCallback,
  errorCallback,
}: {
  text: string;
  successCallback?: () => void;
  errorCallback?: () => void;
}) {
  if (navigator) {
    navigator.clipboard.writeText(text).then(
      function () {
        if (successCallback) {
          successCallback();
        }
      },
      function () {
        if (errorCallback) {
          errorCallback();
        }
      },
    );
  } else {
    if (errorCallback) {
      errorCallback();
    }
  }
}
