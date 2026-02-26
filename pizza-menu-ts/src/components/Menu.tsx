
const pizzaData = [
  {
    name: "Focaccia",
    ingredients: "Bread with italian olive oil and rosemary",
    price: 6,
    photoName: "pizzas/focaccia.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Margherita",
    ingredients: "Tomato and mozarella",
    price: 10,
    photoName: "pizzas/margherita.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "pizzas/spinaci.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Funghi",
    ingredients: "Tomato, mozarella, mushrooms, and onion",
    price: 12,
    photoName: "pizzas/funghi.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Salamino",
    ingredients: "Tomato, mozarella, and pepperoni",
    price: 15,
    photoName: "pizzas/salamino.jpg",
    soldOut: true,
  },
  {
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
    price: 18,
    photoName: "pizzas/prosciutto.jpg",
    soldOut: false,
  },
];


function Menu() {
  const pizzaAmount: number = pizzaData.length

  return (
    // style={{ display: "flex-col", justifyContent: "center" }}
    <div className="menu" >
      <h2>Our menu</h2>

      {pizzaAmount > 0 ?
        (
          <>
            <p>
              Authentic Italian cuisine. 6 creative dishes to choose from. All
              from our stone oven, all organic, all delicious.
            </p>

            {/* 看pizzas和pizza的css  */}
            <ul className="pizzas">
              {pizzaData.map((pizza) =>
                <Pizza name={pizza.name} ingredients={pizza.ingredients} price={pizza.price} photoName={pizza.photoName} soldOut={pizza.soldOut} ></Pizza>)}
            </ul>
          </>)
        : (<p>We're still working on our menu. Please come back later :)</p>)}
    </div>
  );
}


// 解构不是这样写的!!
// function Pizza({ name: string, ingredients: string, price: number, photoName: string, soldOut: boolean }) {

// 首先定义一个 props 类型 
interface PizzaProps {
  name: string;
  ingredients: string;
  price: number;
  photoName: string;
  soldOut: boolean;
}
// 然后在函数签名中使用它: 
function Pizza({ name, ingredients, price, photoName, soldOut }: PizzaProps) {


  return (
    <>
      {/* 每一个条目 用li包裹 */}
      {/* 信息需要有呈现的格式 所以这里要有css */}
      <li className="pizza">
        {/* img 注意图片路径  直接就是pizzas/....   不用写public 因为默认会在public里面找 */}
        <img src={photoName} alt={name} />
        {/* img 和文字信息是左右布局  用div包裹文本信息 */}
        <div>
          <h3>{name}</h3>
          <p>{ingredients}</p>
          <span>{soldOut ? "SOLD OUT" : price}</span>
        </div>
      </li>
    </>

  )

}
export default Menu;
