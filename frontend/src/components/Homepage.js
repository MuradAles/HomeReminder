import React from 'react'
import Button from "react-bootstrap/Button"

function Homepage() {
  return (
    <div class="flex-container">
    <div className="box box1">
      <h1>Moving,</h1>
      <h1>made simple and organized</h1>
      </div>
    <div className="box box2">
      <Button variant = "custom"> Start Planning </Button></div>
    <div className="box box3">
      <div class = "p2">
      <p3>Why Home Reminder?</p3>
      </div>
      </div>
    <div className="box box4">
    <div class = "p3">
      <p>Based on results from our team's survey, over 70% of dorm-residing students expressed their desire
       for an app that would allow them to streamline the organization and planning of their new residences. 
       Introducing Home Reminder - an app that allows users to easily categorize and assign items to specific 
       rooms within their living spaces.Whether managing a single room or an entire household, the app provides
       a seamless solution for users to regain control over their living spaces, fostering a more organized and 
       stress-free environment. </p> 
      </div> 
    </div>
</div>
  )
}

export default Homepage
