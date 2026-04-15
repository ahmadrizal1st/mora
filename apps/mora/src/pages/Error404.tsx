// src/pages/Error404.tsx
import ErrorLayout from '@/shared/layouts/ErrorLayout'

const errors = {
  "404": {
    title: "404",
    description: "We are sorry but the page you are looking for was not found",
    illustration: "not-found"
  }
}

export default function Error404() {
  return <ErrorLayout errorCode="404" errors={errors} />
}