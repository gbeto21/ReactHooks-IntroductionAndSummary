import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';

function Ingredients() {

  const [ingredients, setIngredients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

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

    setIsLoading(true)
    fetch(
      'https://react-hooks-update-65e04-default-rtdb.firebaseio.com/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' }
      }
    ).then(response => {
      setIsLoading(false)
      return response.json()
    }
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

    setIsLoading(true)
    fetch(
      `https://react-hooks-update-65e04-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE'
      }
    ).then(response => {
      setIsLoading(false)
      setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== ingredientId))
    }).catch(error => {
      setError("Something went wrong!")
      setIsLoading(false)
    })
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadingIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
