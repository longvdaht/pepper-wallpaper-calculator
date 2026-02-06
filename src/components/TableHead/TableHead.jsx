import { h } from 'preact'

import createClassName from '../../utilities/createClassName'

const DISPLAY_NAME = 'TableHead'

const Component = () => (
	<thead>
		<tr class={createClassName('table-row head')}>
			<th
				colSpan={2}
				class={createClassName('table-head')}
			>
				Width
			</th>
			<th
				colSpan={2}
				class={createClassName('table-head')}
			>
				Height
			</th>
		</tr>
	</thead>
)

Component.displayName = DISPLAY_NAME

export default Component
