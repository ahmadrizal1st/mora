// src/pages/Error429.tsx
import ErrorLayout from '../layouts/ErrorLayout'

const errors = {
  "429": {
    title: "429",
    description: "We are sorry but you have made too many requests in a short period of time. Please try again later.",
    illustration: "wait"
  }
}

export default function Error429() {
  return <ErrorLayout errorCode="429" errors={errors} />
}
