// src/pages/Error500.tsx
import ErrorLayout from '../layouts/ErrorLayout'

const errors = {
  "500": {
    title: "500",
    description: "We are sorry but the page you are looking for was not found",
    illustration: "500"
  }
}

export default function Error500() {
  return <ErrorLayout errorCode="500" errors={errors} />
}