import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {

  const [ingredients, setIngredients] = useState([])

  /** This useEffect was wrote on a previous
   * class of What's useCallback.
   */
  useEffect(() => {
    console.log('RENDERING INGREDIENTS', ingredients);
  }, [ingredients])

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients)
  }, [])

  const addIngredientHandler = ingredient => {

    fetch(
      'https://react-hooks-update-65e04-default-rtdb.firebaseio.com/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' }
      }
    ).then(response => response.json()
    ).then(responseData => {
      setIngredients(
        prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]
      )
    })
  }

  const removeIngredientHandler = ingredientId => {

    fetch(
      `https://react-hooks-update-65e04-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE'
      }
    ).then(response => {
      setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientId))
    })
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadingIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
