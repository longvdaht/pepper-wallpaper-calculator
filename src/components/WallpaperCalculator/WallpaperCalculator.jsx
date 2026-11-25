import { createRef } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { h } from 'preact'
import { effect, useSignal } from '@preact/signals'
import createClassName from '../../utilities/createClassName'
import { displayTotal, addersTotal, subtractorsTotal, adderArray, subtractorArray, addersWidthTotal, wallArray, wallHeightArray, addersHeightCheck } from '../Signals/TotalSignal'

import Murals from '../../assets/wallpaper-murals.png'
import ClayCoated from '../../assets/wallpaper-clay-coated.png'
import Removable from '../../assets/wallpaper-removable.png'
import Performance from '../../assets/wallpaper-performance.png'
import SolidGrasscloth from '../../assets/wallpaper-solid-grasscloth.jpg'
import PatternedGrasscloth from '../../assets/wallpaper-patterned-grasscloth.png'

import Table from '../Table'
import TableHead from '../TableHead'
import TableBody from '../TableBody'

const DISPLAY_NAME = 'WallpaperCalculator'
const DEFAULT_ADDER_ROWS = 4
const DEFAULT_SUBTRACTOR_ROWS = 4
const SHOW_ADD_REMOVE_ROW_BUTTONS = true

const WALLPAPER_TYPES = [
	{
		name: "Clay Coated",
		width: "27 in. wide",
		description: "Our standard eco-friendly paper",
		widthDenominator: 1,
		ratio: 1,
		image: {
			src: ClayCoated,
			alt: "",
		},
		coverage: 6.75
	},
	{
		name: "Removable",
		width: "27 in. wide",
		description: "Pre-trimmed and seamless to remove",
		widthDenominator: 1,
		ratio: 1,
		image: {
			src: Removable,
			alt: "",
		},
		panelWidth: 2.25
	},
	{
		name: "Performance",
		width: "51 in. wide",
		description: "Scratch and water resistance",
		widthDenominator: 1,
		ratio: 1,
		image: {
			src: Performance,
			alt: "",
		},
		coverage: 12.75
	},
	{
		name: "Solid Grasscloth",
		width: "36 in. wide",
		description: "Hand-dyed and woven by artisans",
		widthDenominator: 1,
		ratio: 1,
		yardsPerRoll: 8,
		overlap: 0,
		image: {
			src: SolidGrasscloth,
			alt: "",
		},
		coverage: 72
	},
	{
		name: "Patterned Grasscloth",
		width: "33 in. wide",
		description: "Hand-woven with signature patterns",
		widthDenominator: 1,
		ratio: 1,
		image: {
			src: PatternedGrasscloth,
			alt: "",
		},
		coverage: 8.25
	},
	{
		name: "Murals",
		width: "27 in. wide",
		description: "Seamless, large-scale statement",
		widthDenominator: 1,
		ratio: 1,
		image: {
			src: Murals,
			alt: "",
		},
		panelWidth: 2.25
	},
];

const createArrayOfLength = (length, value) => Array(length).fill(value)
const calculateAdders = adders => adders.reduce((a, b) => a + b, 0)
const calculateSubtractors = subtractors => subtractors.reduce((a, b) => a + b, 0)
const checkAddersHeight = adders => adders.length ? adders.reduce((a, b) => Math.max(a, b), -Infinity) : 0
const calculateTotal = (adders, subtractors, material, heightCheck) => {
	if (!material) return 0
  if (material.name === 'Murals' || material.name === 'Removable') {
    if (adders < 0) return 0;
    
    const panels = Math.ceil(adders / material.panelWidth + 1)

    if (heightCheck !== null) {
      if (heightCheck < 10) {
        return panels + ' x 10\' Panels'
      } else if (heightCheck >= 10 && heightCheck < 12) {
        return panels + ' x 12\' Panels'
      } else {
        return "our maximum panel height is 12'"
      }
    }
    return Math.ceil(adders / material.panelWidth + 1)

	} else {
		const calculatedValue = adders - subtractors
		if (calculatedValue < 0) return 0
		return Math.ceil(calculatedValue / material.coverage * 1.15 + 1) 
	}
}

const Component = () => {
	const [adderRows, setAdderRows] = useState(() => createArrayOfLength(DEFAULT_ADDER_ROWS, 0))
	const [subtractorRows, setSubtractorRows] = useState(() => createArrayOfLength(DEFAULT_SUBTRACTOR_ROWS, 0))
	const [wallpaperType, setWallpaperType] = useState(null);
	const [unitOfMeasure, setUnitOfMeasure] = useState('Yards')

	addersTotal.value = calculateAdders(adderRows);
	subtractorsTotal.value = calculateSubtractors(subtractorRows);

	const total = useSignal(displayTotal)

	const handleAddAdderRow = () => setAdderRows([...adderRows, 0])
	const handleAddSubtractorRow = () => setSubtractorRows([...subtractorRows, 0])

	const stepOne = createRef();
	const stepTwo = createRef();
	const [showStepTwo, setShowStepTwo] = useState(false);

	const setWallpaperTypeAndRecalculate = (e) => {
		if (!!!e.target.value) {
			setWallpaperType(null);
		} else {
			setWallpaperType(WALLPAPER_TYPES[e.target.value])
		}
		// console.log(stepOne, stepTwo)
		// window.scroll(0, stepTwo.current.base.offsetTop)
		setShowStepTwo(true)
		if (showStepTwo) {
			stepTwo.current.scrollIntoView({ behavior: 'smooth' });
		}
	}
	useEffect(() => {
		if (showStepTwo) {
			stepTwo.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [showStepTwo]);

	const stepThree = createRef();
	const [showStepThree, setShowStepThree] = useState(false);
	useEffect(() => {
		if (showStepThree) {
			stepThree.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [showStepThree]);

	const handleResetButton = () => {
		setWallpaperType(null);
		setAdderRows(createArrayOfLength(DEFAULT_ADDER_ROWS, 0))
		setSubtractorRows(createArrayOfLength(DEFAULT_SUBTRACTOR_ROWS, 0))
		stepOne.current.scrollIntoView({ behavior: 'smooth' });
		setShowStepTwo(false)
		setShowStepThree(false)
	}
	const handleContinueButton = () => {
		setShowStepThree(true);
	}
	

	const SelectWallpaperType = ({ setWallpaperType }) => {
		return (
			<div class="wallpaper-type">
				{WALLPAPER_TYPES.map((wallpaper, i) => (
					wallpaperType?.name === wallpaper.name ? (
						<button key={i} value={i} aria-current={true}>
							<img
								src={wallpaper.image.src}
								alt={wallpaper.image.alt}
							/>
							<div className="option-title">{wallpaper.name}</div>
							<div className="option-width">{wallpaper.width}</div>
							<div className="option-description">{wallpaper.description}</div>
						</button>
					) : (
							<button key={i} onClick={setWallpaperType} value={i}>
							<img
								src={wallpaper.image.src}
								alt={wallpaper.image.alt}
							/>
								<div className="option-title">{wallpaper.name}</div>
								<div className="option-width">{wallpaper.width}</div>
								<div className="option-description">{wallpaper.description}</div>
							</button>
					)
				))}
			</div>
		)
	}

	const handleAdderRowCalculated = indexToUpdate => newValue => {
		const newAdderRowTotals = adderRows.map((value, index) => (index !== indexToUpdate ? value : newValue))
		adderArray.value[indexToUpdate] = newValue
		setAdderRows(newAdderRowTotals)
	}

	const handleSubtractorRowCalculated = indexToUpdate => newValue => {
		const newSubtractorRowTotals = subtractorRows.map((value, index) => (
			index !== indexToUpdate ? value : newValue
		))
		subtractorArray.value[indexToUpdate] = newValue
		setSubtractorRows(newSubtractorRowTotals)
	}

	const handleWidthAdderCalculated = indexToUpdate => newValue => {
		wallArray.value[indexToUpdate] = newValue
	}
  const handleHeightAdderCalculated = indexToUpdate => newValue => {
		wallHeightArray.value[indexToUpdate] = newValue
	}

	effect(() => {
		addersTotal.value = calculateAdders(adderArray.value);
		subtractorsTotal.value = calculateSubtractors(subtractorArray.value);
		addersWidthTotal.value = calculateAdders(wallArray.value);
    addersHeightCheck.value = checkAddersHeight(wallHeightArray.value);
		let currentUnitOfMeasure = 'Yards'
		if (wallpaperType && wallpaperType.name === "Solid Grasscloth") {
			currentUnitOfMeasure = 'Rolls'
		} else if (wallpaperType && (wallpaperType.name === "Removable" || wallpaperType.name === "Murals")) {
			currentUnitOfMeasure = 'Panels'
		}
		
		if (wallpaperType) {
			if (wallpaperType.name === "Murals" || wallpaperType.name === "Removable") {
        total.value = calculateTotal(addersWidthTotal, subtractorsTotal, wallpaperType, addersHeightCheck);
			} else {
				total.value = calculateTotal(addersTotal, subtractorsTotal, wallpaperType)
			}
		}
		
		setUnitOfMeasure(currentUnitOfMeasure)
	}, [adderArray, subtractorArray, wallpaperType])

	const isProductPage = window.location.pathname.startsWith('/products/');
	const stepTwoAvailable = !showStepThree && !isProductPage

	return (
		<div class={createClassName('wrapper')}>
			<div class={`${createClassName('step__outer step__one')}${!isProductPage && showStepThree ? ' visually-hidden' : ''}`} ref={stepOne}>
				<p class={createClassName('step')}>
					Step 1
				</p>
				<h1 class={createClassName('type-description')}>
					Select Your Ground Material
				</h1>
				<p class={createClassName('footer-text')}>
					Note: Calculations will differ between grounds.
				</p>
				<SelectWallpaperType setWallpaperType={setWallpaperTypeAndRecalculate} /></div>
			<div class={(showStepTwo && !showStepThree) || (showStepTwo && isProductPage) ? 'step__outer step__two' : 'step__outer step__two visually-hidden'} ref={stepTwo}>
				<p class={createClassName('step')}>
					Step 2
				</p>
				<h1 class={createClassName('type-description')}>
					Enter Your Measurements
				</h1>
				<p class={createClassName('footer-text')}>
					Our calculations include extra yardage to account for trimming and pattern alignment.<br/>Note: This is an estimate—be sure to get an official quote from your wallpaper installer before ordering.
				</p>
				<div class={createClassName('sections-wrapper')}>
					<div class={createClassName('section-wrapper')}>
						<h3 class={createClassName('section-heading')}>
							Wall Measurements
						</h3>
						{adderRows.map((_, index) => (
							<div
								class={createClassName('table-wrapper')}
								key={index}
							>
								<Table>
									<caption>
										Wall {index + 1}
									</caption>
									<TableHead />
									<TableBody
										type="adder"
										wallpaperType={wallpaperType}
										index={index}
										onRowCalculated={handleAdderRowCalculated(index)}
										onRowWidthCalculated={handleWidthAdderCalculated(index)}
                    onRowHeightCalculated={handleHeightAdderCalculated(index)}
									/>
								</Table>
							</div>
						))}
						{SHOW_ADD_REMOVE_ROW_BUTTONS && (
							<button className="button" onClick={handleAddAdderRow}>
								Add wall
							</button>
						)}
					</div>
					<div class={createClassName('section-wrapper')}>
					<h3 class={createClassName('section-heading')}>
						Areas Without Wallpaper
					</h3>
					{subtractorRows.map((_, index) => (
						<div
							class={createClassName('table-wrapper')}
							key={index}
						>
							<Table>
								<caption>
									Window / Door / Closet {index + 1}
								</caption>
								<TableHead />
								<TableBody
									type="subtractor"
									index={index}
									wallpaperType={wallpaperType}
									onRowCalculated={handleSubtractorRowCalculated(index)}
								/>
							</Table>
						</div>
					))}
					{SHOW_ADD_REMOVE_ROW_BUTTONS && (
						<button className="button" onClick={handleAddSubtractorRow}>
							Add area
						</button>
					)}
					</div>
				</div>
				{!isProductPage &&
				(
					<div class={createClassName('btn-actions')}>
						<button type="button" class="btn btn-continue" onClick={handleContinueButton}>
							Continue
						</button>
						<button type="button" class="btn-back" onClick={handleResetButton}>
							Back
						</button>
					</div>
				)}
			</div>
			<div class={wallpaperType !== null && (isProductPage || showStepThree) ? createClassName('step__outer step__three') : `visually-hidden ${createClassName('step__outer step__three')}`} ref={stepThree}>
				<div class={createClassName('result-wrapper-outer')}>
					<h3 class={createClassName('section-heading final-section-heading')}>
						{`Estimate:`}
					</h3>
					<div class={createClassName('result-wrapper')}>
						{wallpaperType !== null && (wallpaperType.name === "Removable" || wallpaperType.name === "Murals") ? total : `${total} ${unitOfMeasure}`} 
					</div>
				</div>
				<div class={createClassName('reset-wrapper-outer')}>
					<button type="button" onClick={handleResetButton}>
						Reset
					</button>
				</div>
			</div>
		</div>
	)
}

Component.displayName = DISPLAY_NAME

export default Component