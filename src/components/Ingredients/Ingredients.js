import React, { useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal'
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id)

    default:
      break;
  }
}

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null }

    case "RESPONSE":
      return { ...curHttpState, loading: false }

    case "ERROR":
      return { loading: false, error: action.errorMessage }

    case "CLEAR":
      return { ...curHttpState, error: null }

    default:
      break;
  }
}

function Ingredients() {

  const [ingredients, dispatch] = useReducer(ingredientReducer, [])
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null })

  /** This useEffect was wrote on a previous
   * class of What's useCallback.
   */
  useEffect(() => {
    console.log('RENDERING INGREDIENTS', ingredients);
  }, [ingredients])

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients })
  }, [])

  const addIngredientHandler = ingredient => {

    dispatchHttp({ type: 'SEND' })
    fetch(
      'https://react-hooks-update-65e04-default-rtdb.firebaseio.com/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' }
      }
    ).then(response => {
      dispatchHttp({ type: 'RESPONSE' })
      return response.json()
    }
    ).then(responseData => {
      dispatch({
        type: 'ADD',
        ingredient: {
          id: responseData.name,
          ...ingredient
        }
      })
    })
  }

  const removeIngredientHandler = ingredientId => {

    dispatchHttp({ type: 'SEND' })
    fetch(
      `https://react-hooks-update-65e04-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE'
      }
    ).then(response => {
      dispatchHttp({ type: 'RESPONSE' })
      dispatch({
        type: 'DELETE',
        id: ingredientId
      })
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', errorMessage: "Something went wrong!" })
    })
  }

  const clearError = () => {
    dispatchHttp({ type: 'CLEAR' })
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadingIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
