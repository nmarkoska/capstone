import React, { useEffect, useState } from 'react';
import { firestore } from '../../Firebase/config';
import './AdminRecipes.css';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';

const AdminRecipes = ({}) => {

    const [collectionData, setCollectionData] = useState([]);
    const [editMode, setEditMode] = useState(false); // State to track if edit mode is active
    const [editedRecipe, setEditedRecipe] = useState(null);

    console.log({editMode})


    useEffect(() => {
    const fetchData = async () => {
        try {
        const collectionRef = firestore.collection('Recepti');
        const snapshot = await collectionRef.get();

        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));

        setCollectionData(data);
        } catch (error) {
        console.error('Error fetching collection:', error);
        }
    };

    fetchData();
    }, []);

    const handleEdit = (recipe) => {
        setEditedRecipe({ ...recipe }); // Save a copy of the recipe being edited
        setEditMode(true); // Activate edit mode
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedRecipe(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Save the edited recipe to the database
        // You'll need to implement this part using Firestore update method
        // After saving, reset edit mode and clear edited recipe
        setEditMode(false);
        setEditedRecipe(null);
    };


return (
    <div className='AdminRecipes-container'>

       { collectionData.map(recipe => {
            return(
                <div className="recipe-card" key={recipe.id}>
                <img className="recipe-image" src={recipe.IMG} alt={recipe.Ime} />
                <div className="recipe-content">
                <h2 className="recipe-title">{recipe.Ime} </h2>
                <div>
                
                <Button sx={{color: 'black'}} onClick={() => handleEdit(recipe)} >
                edit
                </Button>
                <Button sx={{color: 'red'}}>
                Delete
                </Button>
                </div>
                <h3 className="recipe-subtitle">Состојки</h3>
                <ul className="recipe-ingredients">
                    {recipe.Sostojki && recipe.Sostojki.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                    ))}
                </ul>
                <h3 className="recipe-subtitle">Подготовка</h3>
                {editMode ?  <TextField
          label="Podgotovka"
          variant="outlined"
          multiline
          rows={4}
          name="Podgotovka"
          value={recipe.Podgotovka}
          onChange={handleInputChange}
          sx={{ marginBottom: '20px' }} 

        /> :  <ol className="recipe-instructions">
                    {recipe.Podgotovka}
                </ol>}
               
                <h3>Калории</h3>
                <p>{recipe.Kalorii}</p>

                <h3>
                    Време на подготовка 
                    {`${recipe.Vreme?.Saati === undefined ? "" : `${recipe.Vreme?.Saati}h`} 
                ${recipe.Vreme?.Minuti}`}  
                </h3>
                
                </div>
                {/* <button>
                    Podgotovka
                </button> */}
            </div>
            )
        })}
    </div>
)
}

export default AdminRecipes