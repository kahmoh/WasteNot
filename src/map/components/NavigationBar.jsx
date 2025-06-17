import React from 'react'

function NavBarQuickFilter(props) {
    return (
        <button className="nav-bar-quick-filter">
            {props.text}
        </button>
    )
}

function NavigationBar() {
  return (
    <div className={"navigation-bar"}>
      <input type={"text"} placeholder={"Search food item here"}/>
        <NavBarQuickFilter text="All"/>
        <NavBarQuickFilter text="Food Banks"/>
        <NavBarQuickFilter text="Vegan"/>
        <NavBarQuickFilter text="Halal"/>
    </div>
  )
}

export default NavigationBar