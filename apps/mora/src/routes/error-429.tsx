import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/error-429')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/error-429"!</div>
}
