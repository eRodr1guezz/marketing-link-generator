import { render } from '@testing-library/react'
import Form from './Components/Form/Form'

const WrapperProvider = ({ children }) => {
  return (
    <Form>
      { children }
    </Form>
  )
}

const customRender = (ui, options) => {
  render(ui, { wrapper: WrapperProvider, ...options })
}

export * from '@testing-library/react'
export { customRender as render }