import { h } from 'preact'

import createClassName from '../../utilities/createClassName'

const DISPLAY_NAME = 'Table'

const Component = ({ children }) => (
	<table class={createClassName('table')}>
		{children}
	</table>
)

Component.displayName = DISPLAY_NAME

export default Component
