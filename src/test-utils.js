import { render } from '@testing-library/react'

const Wrapper = ({ children }) => <div>{children}</div>

const WrapperProvider = ({ children, props }) => {
  return (
    <Wrapper props={props}>{children}</Wrapper>
  )
}

const customRender = (ui, options) => {
  render(ui, { wrapper: WrapperProvider, ...options })
}

export * from '@testing-library/react'
export { customRender as render }