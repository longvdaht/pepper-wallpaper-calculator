import { h } from 'preact'
import { useEffect, useState, useCallback } from 'preact/hooks'

import createClassName from '../../utilities/createClassName'

const DISPLAY_NAME = 'TableBody'
const HEIGHT_DENOMINATOR = 1

const convertFeetToInches = value => value * 12
const convertInchesToFeet = (feet, inches) => {
	return parseFloat(feet || 0) + (parseFloat(inches || 0) / 12);
  };

const calculateAdderRow = ({ widthFeet, widthInches, heightFeet, heightInches, widthDenominator, ratio, overlap = 27 }) => {
	const width = convertInchesToFeet(widthFeet, widthInches)
	const height = convertInchesToFeet(heightFeet, heightInches)
	const calculatedWidth = width / widthDenominator
	const calculatedHeight = height / HEIGHT_DENOMINATOR
	const total = calculatedWidth * calculatedHeight
	return total
}

const calculateSubtractorRow = ({ widthFeet, widthInches, heightFeet, heightInches, widthDenominator, ratio, }) => {
	const width = convertInchesToFeet(widthFeet, widthInches)
	const height = convertInchesToFeet(heightFeet, heightInches)
	const calculatedWidth = width / widthDenominator
	const calculatedHeight = height / HEIGHT_DENOMINATOR
	return calculatedWidth * calculatedHeight
}

const calculateWallWidth = ({ widthFeet, widthInches }) => {
	return convertInchesToFeet(widthFeet, widthInches)
}

const calculateWallHeight = ({ heightFeet, heightInches }) => {
	return convertInchesToFeet(heightFeet, heightInches)
}

const handleFocus = e => e.target.select()

const Input = ({ onInput, value }) => (
	<input
		class={createClassName('number-field')}
		onFocus={handleFocus}
		onInput={onInput}
		value={value}
		type="number"
	/>
)

const Component = ({ onRowCalculated, type, wallpaperType, onRowWidthCalculated, onRowHeightCalculated }) => {
	const [widthFeet, setWidthFeet] = useState(0)
	const [widthInches, setWidthInches] = useState(0)
	const [heightFeet, setHeightFeet] = useState(0)
	const [heightInches, setHeightInches] = useState(0)

	const handleWidthFeetInput = e => setWidthFeet(parseInt(e.target.value, 10) || 0)
	const handleWidthInchesInput = e => setWidthInches(parseInt(e.target.value, 10) || 0)
	const handleHeightFeetInput = e => setHeightFeet(parseInt(e.target.value, 10) || 0)
	const handleHeightInchesInput = e => setHeightInches(parseInt(e.target.value, 10) || 0)

	if (wallpaperType === null) {
		setWidthFeet(0)
		setWidthInches(0)
		setHeightFeet(0)
		setHeightInches(0)
	}

	useEffect(() => {
		const method = type === 'adder' ? calculateAdderRow : calculateSubtractorRow
		const calculated = method({
			widthFeet: widthFeet ?? 0,
			widthInches: widthInches ?? 0,
			heightFeet: heightFeet ?? 0,
			heightInches: heightInches ?? 0,
			widthDenominator: wallpaperType?.widthDenominator ?? 27,
			ratio: wallpaperType?.ratio ?? 1,
			overlap: wallpaperType?.overlap ?? 27,
		})
		onRowCalculated(calculated)
		if (onRowWidthCalculated) {
			onRowWidthCalculated(
				calculateWallWidth({
					widthFeet: widthFeet ?? 0,
					widthInches: widthInches ?? 0,
				})
			)
		}
		if (onRowHeightCalculated) {
			onRowHeightCalculated (
				calculateWallHeight({
					heightFeet: heightFeet ?? 0,
					heightInches: heightInches ?? 0,
				})
			)
		}
		
	}, [
		widthFeet,
		widthInches,
		heightFeet,
		heightInches,
		wallpaperType
	])

	return (
		<tbody>
			<tr class={createClassName('table-row')}>
				<td class={createClassName('table-cell')}>
					<div class={createClassName('table-cell-content')}>
						<Input
							onInput={handleWidthFeetInput}
							value={widthFeet}
						/>
						<span class={createClassName('table-cell-unit')}>
							ft
						</span>
					</div>
				</td>
				<td class={createClassName('table-cell')}>
					<div class={createClassName('table-cell-content')}>
						<Input
							onInput={handleWidthInchesInput}
							value={widthInches}
						/>
						<span class={createClassName('table-cell-unit')}>
							in
						</span>
					</div>
				</td>
				<td class={createClassName('table-cell')}>
					<div class={createClassName('table-cell-content')}>
						<Input
							onInput={handleHeightFeetInput}
							value={heightFeet}
						/>
						<span class={createClassName('table-cell-unit')}>
							ft
						</span>
					</div>
				</td>
				<td class={createClassName('table-cell')}>
					<div class={createClassName('table-cell-content')}>
						<Input
							onInput={handleHeightInchesInput}
							value={heightInches}
						/>
						<span class={createClassName('table-cell-unit')}>
							in
						</span>
					</div>
				</td>
			</tr>
		</tbody>
	)
}

Component.displayName = DISPLAY_NAME

export default Component
