/**
 * File		: OptionManipulator.js
 * Author	: Robert Carbajal 
 * Version	: 1.0
 * Created	: 2006-01-26
 */

/**
 * Maximum number of allowed option swaps used to keep option swapping down
 */
var _MAX_SWAP_COUNT = 20;

/**
 * Variables to keep track of left and right listboxes
 */
 var _leftListBox = null;
 var _rightListBox = null;
 

/**
 * Creates a new instance of an OptionManipulator object.
 *
 * @param leftid
 * 		String value of id attribute of <SELECT> element considered to be the "left" side element to manipulate.
 * @param rightid
 * 		String value of id attribute of <SELECT> element considered to be the "right" side element to manipulate.
 * @throws IllegalArgumentException
 * 		If either parameter value does not describe a <SELECT> element or is not specified.
 */
function OptionManipulator(leftid, rightid)
{
	//check arguments were specified
	if(!leftid || !rightid)
	{
		throw new IllegalArgumentException("One or more <SELECT> element id's not specified.  Unable to create OptionManipulator object.");
	}
	
	//assign local variables
	this._leftListBox = document.getElementById(leftid);
	this._rightListBox = document.getElementById(rightid);
	
	//check listbox objects are in fact select boxes
	if(!this._leftListBox || !this._leftListBox.options || !this._rightListBox || !this._rightListBox.options)
	{ 
		throw new IllegalArgumentException("One or more specified elements not a <SELECT> element.  Unable to create OptionManipulator object.");
	}
	
	//assign method prototypes
	this.moveRight = _moveRight;
	this.moveLeft = _moveLeft;
	this.moveUp = _moveUp;
	this.moveDown = _moveDown;
	this.moveToPosition = _moveToPosition;
	this.sortNumeric = _sortNumeric;
	this.sortAlphabetic = _sortAlphabetic;
	this.getOptionValues = _getOptionValues;
	this.selectAll = _selectAll;
	this.selectNone = _selectNone;
	
	return;
}

/**
 * Moves the selected options from the left <SELECT> element to the right <SELECT> element.  The
 * function is overloaded so as to be able to accept an argument that determines whether or not
 * selected-only options should be moved or that all options should be moved.  If the argument is
 * omitted, then only selected options will be moved by default.
 * 
 * @param doMoveAll
 * 		Boolean value specifying that either all options or only selected options should be moved.
 * 		If false, then only selected options will be moved.  If true, all options will be moved.
 * 		Default value is false.
 * @return
 * 		True if all selected options were successfully moved to the right side.
 */
function _moveRight(doMoveAll)
{
	if(doMoveAll != true && doMoveAll != false)
	{
		doMoveAll = false;
	}
	
	var currOption = null;
	
	if(doMoveAll)
	{
		for(var i = 0; i < this._leftListBox.length;)
		{
			currOption = this._leftListBox.options[i];
			
			//create new option to add from option to be removed
			var toAdd = new Option();
			toAdd.value = currOption.value;
			toAdd.text = currOption.text;
			
			this._rightListBox.options[this._rightListBox.length] = toAdd;
			this._leftListBox.remove(i);
		}
	}
	else
	{
		var optionsToMove = new Array();
		
		for(var i = this._leftListBox.length - 1; i >= 0; i--)
		{
			currOption = this._leftListBox.options[i];

			if(currOption.selected) //if current option is selected
			{
				//create new option to add from option to be removed
				var toAdd = new Option();
				toAdd.value = currOption.value;
				toAdd.text = currOption.text;
				
				//add new option to 
				optionsToMove.push(toAdd);
				
				this._leftListBox.remove(i);
			}
		}
		
		for(var i = optionsToMove.length - 1; i >= 0; i--)
		{
			this._rightListBox.options[this._rightListBox.length] = optionsToMove[i];
		}
	}

	return true;
}

/**
 * Moves the selected options from the right <SELECT> element to the left <SELECT> element.  The
 * function is overloaded so as to be able to accept an argument that determines whether or not
 * selected-only options should be moved or that all options should be moved.  If the argument is
 * omitted, then only selected options will be moved by default.
 * 
 * @param doMoveAll
 * 		Boolean value specifying that either all options or only selected options should be moved.
 * 		If false, then only selected options will be moved.  If true, all options will be moved.
 * 		Default value is false.
 * @return
 * 		True if all selected options were successfully moved to the left side.
 */
function _moveLeft(doMoveAll)
{
	if(doMoveAll != true && doMoveAll != false)
	{
		doMoveAll = false;
	}
	
	var currOption = null;
	
	if(doMoveAll)
	{
		for(var i = 0; i < this._rightListBox.length;)
		{
			currOption = this._rightListBox.options[i];
			
			//create new option to add from option to be removed
			var toAdd = new Option();
			toAdd.value = currOption.value;
			toAdd.text = currOption.text;
			
			this._rightListBox.remove(i);
			this._leftListBox.options[this._leftListBox.length] = toAdd;
		}
	}
	else
	{
		var optionsToMove = new Array();
		
		for(var i = this._rightListBox.length - 1; i >= 0; i--)
		{
			currOption = this._rightListBox.options[i];
			
			if(currOption.selected) //if current option is selected
			{
				var toAdd = new Option();
				toAdd.value = currOption.value;
				toAdd.text = currOption.text;
				
				//add new option to to-move list
				optionsToMove.push(toAdd);
				
				//remove selected option from right list box
				this._rightListBox.remove(i);
			}
		}
		
		//add new options to left list box
		for(var i = optionsToMove.length - 1; i >= 0; i--)
		{
			this._leftListBox.options[this._leftListBox.options.length] = optionsToMove[i];
		}
	}
	
	return;
}

/**
 * Moves the selected option in the specified list up the specified number of positions.
 * The function is overloaded so as to allow the omission of the second parameter.  In this
 * case, the selected option will be moved one position by default.
 *
 * @param whichBoxChar
 * 		Single character specifying which list box to manipulate.  Valid character values
 * 		are 'L', 'l', 'R' or 'r' for the left or right list boxes.
 * @param moveCount
 * 		Integer representing how many positions to move the selected option(s).
 * @returns
 * 		True if the selected option(s) is/are moved up successfully, false otherwise.
 * @throws IllegalArgumentException 
 * 		If an invalid list box specification character is entered or if the specified number
 * 		of positions to move is not an integer.
 * @return
 * 		True if all options were successfully moved, false otherwise.
 */
function _moveUp(whichBoxChar, moveCount)
{
	var posCount = 1;
	var listbox = null;
	
	try
	{
		listbox = _getSpecifiedBox(whichBoxChar, this._leftListBox, this._rightListBox);
	}
	catch(e)
	{
		throw e;
	}

	//check that a valid number of positions to move is specified
	if(moveCount != null)
	{
		if(isNaN(moveCount))
		{
			throw new IllegalArgumentException("Invalid number of positions to move specified.");
		}
		
		if(moveCount.toString().indexOf(".") != -1)
		{
			throw new IllegalArgumentException("Number of positions to move must be an integer.");
		}
		else
		{
			posCount = moveCount;
		}
	}
	
	//validate that options were selected
	if(listbox.selectedIndex == -1) //if no options were selected
	{
		return false;
	}
	
	var finalPosArray = new Array();
	var selectedOptionsArray = new Array();
	
	//determine destination indices for selected options	
	for(var i = listbox.selectedIndex; i < listbox.options.length; i++)
	{
		if(listbox.options[i].selected)
		{
			//determine final position for selected option and save
			finalPosArray.push(i - posCount);

			//save current option's attributes into new array
			selectedOptionsArray.push(new Option(listbox.options[i].text, listbox.options[i].value));
		}
	}

	//if posCount is relatively small, do swap method for moving options
	if(posCount <= _MAX_SWAP_COUNT)
	{
		//loop through list and swap options until each selected option reaches it's final destination
		for(var i = 0; i < posCount; i++)
		{
			var currOption = null;
			var prevOption = null;
			for(var j = 0; j < listbox.options.length; j++) 
			{
				if (listbox.options[j].selected) 
				{
					if (j != 0 && !listbox.options[j - 1].selected) 
					{
						currOption = listbox.options[j];
						prevOption = listbox.options[j - 1];
						
						_swap(currOption, prevOption);
						
						currOption.selected = false;
						prevOption.selected = true;
					}
				}
			}
		}
	}
	else //do remove/rebuild move method
	{
		var newOptionsArray = new Array();
		
		//create new array holding options in new order
		for(var i = 0; i < listbox.options.length; i++)
		{
			if(!listbox.options[i].selected)
			{
				newOptionsArray.push(new Option(listbox.options[i].text, listbox.options[i].value));
			}
		}
		
		for(var i = 0; i < finalPosArray.length; i++)
		{
			var tempArr1 = new Array();
			var tempArr2 = new Array();			
			
			tempArr1 = newOptionsArray.slice(0, finalPosArray[i]);
			tempArr2 = newOptionsArray.slice(finalPosArray[i]);
			
			tempArr1.push(selectedOptionsArray[i]);
			
			newOptionsArray = tempArr1.concat(tempArr2);
		}
		
		//refill listbox with re-ordered array
		for(var i = 0; i < newOptionsArray.length; i++)
		{
			listbox.options[i] = null;
			listbox.options[i] = newOptionsArray[i];
			listbox.options[i].selected = false;
		}
	}
	
	//reselect original selected options
	for(var i = 0; i < finalPosArray.length; i++)
	{
		listbox.options[finalPosArray[i]].selected = true;
	}

	return true;
}

/**
 * Moves the selected option in the specified list down the specified number of positions.
 * The function is overloaded so as to allow the omission of the second parameter.  In this
 * case, the selected option will be moved one position by default.
 *
 * @param whichBoxChar
 * 		Single character specifying which list box to manipulate.  Valid character values
 * 		are 'L', 'l', 'R' or 'r' for the left or right list boxes.
 * @param moveCount
 * 		Integer representing how many positions to move the selected option(s).
 * @returns
 * 		True if the selected option(s) is/are moved down successfully, false otherwise.
 * @throws IllegalArgumentException 
 * 		If an invalid list box specification character is entered or if the specified number
 * 		of positions to move is not an integer.
 * @return
 * 		True if all options were successfully moved, false otherwise.
 */
function _moveDown(whichBoxChar, moveCount)
{
	var posCount = 1;
	var listbox = null;
	
	try
	{
		listbox = _getSpecifiedBox(whichBoxChar, this._leftListBox, this._rightListBox);
	}
	catch(e)
	{
		throw e;
	}
	
	//check that a valid number of positions to move is specified
	if(moveCount != null)
	{
		if(isNaN(moveCount))
		{
			throw new IllegalArgumentException("Invalid number of positions to move specified.");
		}
		
		if(moveCount.toString().indexOf(".") != -1)
		{
			throw new IllegalArgumentException("Number of positions to move must be an integer.");
		}
		else
		{
			posCount = moveCount;
		}
	}
	
	//validate that options were selected
	if(listbox.selectedIndex == -1) //if no options were selected
	{
		return false;
	}
	
	var finalPosArray = new Array();
	var selectedOptionsArray = new Array();
	
	//determine destination indices for selected options
	for(var i = listbox.selectedIndex; i < listbox.options.length; i++)
	{
		if(listbox.options[i].selected)
		{
			//determine final position for selected option and save
			finalPosArray.push(i + posCount);

			//save current option's attributes into new array
			selectedOptionsArray.push(new Option(listbox.options[i].text, listbox.options[i].value));
		}
	}		

	if(posCount <= _MAX_SWAP_COUNT)
	{
		//loop through list and move options as necessary
		for(var i = 0; i < posCount; i++)
		{
			var currOption = null;
			var nextOption = null;
			for(var j = listbox.options.length - 1; j >= 0; j--) 
			{
				if (listbox.options[j].selected) 
				{
					if (j != listbox.options.length - 1 && !listbox.options[j + 1].selected) 
					{
						currOption = listbox.options[j];
						nextOption = listbox.options[j + 1];
						
						_swap(currOption, nextOption);
						
						//currOption.selected = false;
						//nextOption.selected = true;
					}
				}
			}
		}
	}
	else //do remove/rebuild move method
	{
		var newOptionsArray = new Array();
		
		//create new array holding options in new order
		for(var i = 0; i < listbox.options.length; i++)
		{
			if(!listbox.options[i].selected)
			{
				newOptionsArray.push(new Option(listbox.options[i].text, listbox.options[i].value));
			}
		}
		
		for(var i = 0; i < finalPosArray.length; i++)
		{
			var tempArr1 = new Array();
			var tempArr2 = new Array();			
			
			tempArr1 = newOptionsArray.slice(0, finalPosArray[i]);
			tempArr2 = newOptionsArray.slice(finalPosArray[i]);
			
			tempArr1.push(selectedOptionsArray[i]);
			
			newOptionsArray = tempArr1.concat(tempArr2);
		}
		
		
		//refill listbox with re-ordered array
		for(var i = 0; i < newOptionsArray.length; i++)
		{
			listbox.options[i] = null;
			listbox.options[i] = newOptionsArray[i];
			listbox.options[i].selected = false;
		}
	}
	
	//reselect original selected options
	for(var i = 0; i < finalPosArray.length; i++)
	{
		listbox.options[finalPosArray[i]].selected = true;
	}
		
	return true;
}

/**
 * Moves a selected option to a specified position in the specified <SELECT> element.
 * If more than one option is selected, two things can happen:
 * 		1.  If moving up, then the first selected option will be moved to the specified position
 * 				while the remaining options will move up along with the first option.
 * 		2.  If moving down, then the first selected option will be moved to the specified position
 * 				while the remaining options will move down along with the first option.  If the entered
 * 				position creates a situation where any of the selected options would be moved past the 
 * 				end of the current list, all selected options are moved to the end of the list where the 
 * 				last selected option is the last option in the new list.
 *
 * @param whichBoxChar
 * 		Single character specifying which list box to manipulate.  Valid character values
 * 		are 'L', 'l', 'R' or 'r' for the left or right list boxes.
 * @param moveToPos
 * 		Position to which the selected option(s) should be moved (1-based).
 * @throws IllegalArgumentException 
 * 		If an invalid list box specification character is entered or if an invalid position to move to is entered.
 * @return
 * 		True if the selected option(s) was/were moved successfully, false otherwise.
 */
function _moveToPosition(whichBoxChar, moveToPos)
{
	var listbox = null;
	try
	{
		listbox = _getSpecifiedBox(whichBoxChar, this._leftListBox, this._rightListBox);
	}
	catch(e)
	{
		throw e;
	}
	
	//validate moveToPos
	if(!moveToPos || moveToPos == "")
	{
		throw new IllegalArgumentException("Position to move to must be specified.");
	}

	if(moveToPos < 1 || moveToPos > listbox.options.length)
	{
		throw new IllegalArgumentException("Position to move to must be greater than zero and cannot be larger than the current <SELECT> element's total number of options.");
	}
	
	//retrieve the first selected option's index
	var firstSelectedPos = listbox.selectedIndex;
	if(firstSelectedPos == -1)
	{
		return false;
	}
	
	//retrieve the last selected option's index
	var lastSelectedPos;
	for(var i = listbox.length - 1; i >= 0; i--)
	{
		if(listbox.options[i].selected)
		{
			lastSelectedPos = i;
			break;
		}
	}
	
	//determine how many spaces we have to move
	var moveCount = firstSelectedPos - (moveToPos - 1); 

	//move options
	var result = false;
	var moveCorrection = 0;
	var finalPos = 0;

	if(moveCount > 0) //if moveCount > 0, move up
	{
		finalPos = firstSelectedPos - moveCount;
		
		if(finalPos < 0)
		{
			moveCorrection = moveCount - moveCorrection;
		}
		
		moveCount = moveCount - moveCorrection;
		
		result = this.moveUp(whichBoxChar, moveCount);
	}
	else if(moveCount < 0) //move down
	{
		finalPos = lastSelectedPos + Math.abs(moveCount);

		if(finalPos > listbox.options.length - 1)
		{
			moveCorrection = finalPos - (listbox.options.length - 1);
		}

		moveCount = moveCount + moveCorrection;

		result = this.moveDown(whichBoxChar, Math.abs(moveCount));
	}
	
	return result;
}

/**
 * Sorts the options in the specified <SELECT> element numerically.
 *
 * @param whichBoxChar
 * 		Single character specifying which list box to manipulate.  Valid character values
 * 		are 'L', 'l', 'R' or 'r' for the left or right list boxes.
 * @throws IllegalArgumentException 
 * 		If an invalid list box specification character is entered.
 */
function _sortNumeric(whichBoxChar)
{
	var listbox = null;
	try
	{
		listbox = _getSpecifiedBox(whichBoxChar, this._leftListBox, this._rightListBox);
	}
	catch(e)
	{
		throw e;
	}
	
	//create array to hold sorted options
	var optionsArray = new Array();
	
	//loop through list box collecting options for sorting
	for(var i = 0; i < listbox.options.length; i++)
	{
		optionsArray.push(new Option(listbox.options[i].text, listbox.options[i].value));
	}
	
	//sort array based on text
	optionsArray = optionsArray.sort(_sortNumericAscending);
	//_quicksort(optionsArray);
	//_insertionSort(optionsArray, 0, optionsArray.length - 1);
	
	//loop through list box replacing all options with sorted array's options
	for(var i = 0; i < listbox.options.length; i++)
	{
		listbox.options[i] = new Option(optionsArray[i].text, optionsArray[i].value);
	}

	return;
}

/**
 * Sorts the options in the specified <SELECT> element alphabetically.
 *
 * @param whichBoxChar
 * 		Single character specifying which list box to manipulate.  Valid character values
 * 		are 'L', 'l', 'R' or 'r' for the left or right list boxes.
 * @throws IllegalArgumentException 
 * 		If an invalid list box specification character is entered.
 */
function _sortAlphabetic(whichBoxChar)
{
	var listbox = null;
	try
	{
		listbox = _getSpecifiedBox(whichBoxChar, this._leftListBox, this._rightListBox);
	}
	catch(e)
	{
		throw e;
	}
	
	//create array to hold sorted options
	var optionsArray = new Array();
	
	//loop through list box collecting options for sorting
	for(var i = 0; i < listbox.options.length; i++)
	{
		
		optionsArray.push(new Option(listbox.options[i].text, listbox.options[i].value.toLowerCase()));
	}
	
	//sort array based on text
	optionsArray = optionsArray.sort(_sortAlphabeticAscending);
	
	//loop through list box replacing all options with sorted array's options
	for(var i = 0; i < listbox.options.length; i++)
	{
		listbox.options[i] = new Option(optionsArray[i].text, optionsArray[i].value);
	}

	return;
}

/**
 * Retrieves the values of the "value" attributes of the specified <SELECT> element.
 * 
 * @param whichBoxChar
 * 		Single character specifying which list box to manipulate.  Valid character values
 * 		are 'L', 'l', 'R' or 'r' for the left or right list boxes.
 * @throws IllegalArgumentException 
 * 		If an invalid list box specification character is entered
 * @return
 * 		Array of Strings representing the values of the "value" attributes.
 */
function _getOptionValues(whichBoxChar)
{	
	var listbox = null;
	try
	{
		listbox = _getSpecifiedBox(whichBoxChar, this._leftListBox, this._rightListBox);
	}
	catch(e)
	{
		throw e;
	}
	
	var toReturn = new Array();
	
	//loop through specified listbox options saving values along the way
	for(var i = 0; i < listbox.options.length; i++)
	{
		toReturn.push(listbox.options[i].value);
	}
	
	return toReturn;
}

/**
 * Selects all options in the specified <SELECT> element
 *
 * @param whichBoxChar
 * 		Single character specifying which list box to manipulate.  Valid character values
 * 		are 'L', 'l', 'R' or 'r' for the left or right list boxes.
 * @throws IllegalArgumentException 
 * 		If an invalid list box specification character is entered
 */
function _selectAll(whichBoxChar)
{
	var listbox = null;
	try
	{
		listbox = _getSpecifiedBox(whichBoxChar, this._leftListBox, this._rightListBox);
	}
	catch(e)
	{
		throw e;
	}
	
	for(var i = 0; i < listbox.options.length; i++)
	{
		listbox.options[i].selected = true;
	}
	
	return;
}

/**
 * Deselects all options in the specified <SELECT> element
 *
 * @param whichBoxChar
 * 		Single character specifying which list box to manipulate.  Valid character values
 * 		are 'L', 'l', 'R' or 'r' for the left or right list boxes.
 * @throws IllegalArgumentException 
 * 		If an invalid list box specification character is entered
 */
function _selectNone(whichBoxChar)
{
	var listbox = null;
	try
	{
		listbox = _getSpecifiedBox(whichBoxChar, this._leftListBox, this._rightListBox);
	}
	catch(e)
	{
		throw e;
	}
	
	listbox.selectedIndex = -1;

	return;
}

/*
 * Private function that swaps two <OPTION>s in a <SELECT> element
 */
function _swap(option1, option2)
{
	var tempOption = new Option(option2.text, option2.value);
	tempOption.selected = true;
	
	option2.value = option1.value;
	option2.text = option1.text;
	
	option1.value = tempOption.value;
	option1.text = tempOption.text;
	
	option1.selected = false;

	return;
}

/*
 * Private function that returns a reference to the listbox specified by the whichBoxChar parameter.
 */
function _getSpecifiedBox(whichBoxChar, leftbox, rightbox)
{
	//check that a box identifier character was specified
	if(!whichBoxChar || whichBoxChar == "")
	{
		throw new IllegalArgumentException("Listbox to manipulate not specified.");
	}
	
	//validate that a valid box identifier was specified
	whichBoxChar = whichBoxChar.toUpperCase();
	if(whichBoxChar != "L" && whichBoxChar != "R")
	{
		throw new IllegalArgumentException("Listbox specifier must be either 'L' or 'R'.");
	}
	
	//determine which list box to manipulate
	var listbox = null;
	switch(whichBoxChar)
	{
		case "L":
			listbox = leftbox;
			break;
		case "R":
			listbox = rightbox;
			break;
	}
	
	return listbox;
}

/*
 * Private function that counts the number of selected options in the specified listbox
 */
function _countSelectedOptions(listBox)
{
	var count = 0;
	
	for(var i = 0; i < listBox.options.length; i++)
	{
		if(listBox.options[i].selected)
		{
			count++;
		}
	}
	
	return count;
}

/*
 * Private function that gets the index of the specified listbox's last selected option
 */
function _getLastSelectedIndex(listbox)
{
	var lastSelectedPos;
	for(var i = listbox.length - 1; i >= 0; i--)
	{
		if(listbox.options[i].selected)
		{
			lastSelectedPos = i;
			break;
		}
	}
	
	return lastSelectedPos;
}

/*
 * Private function used by this.sortNumeric() to tell the JavaScript engine to sort an array numerically
 */
function _sortNumericAscending(a, b)
{
	aval = a.value.split("|")[0];
	bval = b.value.split("|")[0];
	
	return aval - bval;
}

/*
 * Private function used by this.sortAlphabetic() to tell the JavaScript engine to sort an array alphabetically
 */
function _sortAlphabeticAscending(a, b)
{
	aval = a.value.split("|")[1];
	bval = b.value.split("|")[1];
	
	if(aval < bval)
	{
		return -1;
	}
	else if(aval > bval)
	{
		return 1;
	}
	
	return 0;
}

/*
 * Private function used to sort the options using Quicksort
 */
function _quicksort(optionsArray)
{
	_qsort(optionsArray, 0, optionsArray.length - 1);
	return;
}

/*
 * Private helper function for _quicksort()
 */
function _qsort(arr, start, end)
{
	if(start >= end)
	{
		return;
	}
	
	//define base case
	if((end - start) < 7)
	{
		_insertionSort(arr, start, end);
		return;
	}
	
	var middle = _partition(arr, start, end);
	_qsort(arr, start, middle - 1)
	_qsort(arr, Number(middle) + 1, end)
	
	return;
}

/*
 * Private helper function for _quicksort()
 */
function _partition(arr, start, end)
{
	var randomIndex = null;
	while(randomIndex == null || (randomIndex < start || randomIndex > end))
	{
		randomIndex = Math.floor(Math.random() * end) + start;
	}
	
	var pivot = randomIndex;
	
	//swap element at start and pivot
	_swap(arr[pivot], arr[start]);
	
	//move pivot back to start as that is now where the pivot element is currently residing
	pivot = start;
	
	var left = start + 1;
	var right = end;
	
	while(left <= right)
	{
		while(left <= end && _sortNumericAscending(arr[left], arr[pivot]) <= 0)
		{
			left++;
		}
		
		while(_sortNumericAscending(arr[right], arr[pivot]) > 0 && right >= start)
		{
			right--;
		}
		
		if(left <= right)
		{
			_swap(arr[left], arr[right]);
		}	
	}
	
	_swap(arr[right], arr[pivot]);

	return right;
}

/*
 * Private helper function for _quicksort()
 */
function _insertionSort(arr, start, end)
{
	for(var i = start + 1; i <= end; i++)
	{
		for(var j = i - 1; j >= start; j--)
		{
			if(_sortNumericAscending(arr[j + 1], arr[j]) < 0)
			{
				_swap(arr[j + 1], arr[j]);
			}
			else
			{
				break;
			}
		}
	}
}

/*
 * Exception class used to handle invalid method parameters
 */
function IllegalArgumentException(_message)
{
	this.message = _message;
	this.toString = new Function("return this.message;");
}