export const buildPlannerSkeleton = (plannerContainer: HTMLDivElement): HTMLDivElement => {
  const startingHour = 0
  const numberOfHour = 24
  const numberOfPixelForOneMinute = 0.5

  const skeleton = plannerContainer.createDiv({ attr: { style: `
    display: flex;
    width: 24rem;
    border: #b6b6b6 1px solid;
    overflow: hidden
  `}})

  const hoursColumn = skeleton.createDiv({ attr: { style: `
    border-right: 1px solid #b6b6b6;
    width: 2rem;
    display: flex;
    flex-direction: column;
  `}})
  const tasksColumn = skeleton.createDiv({ attr: { style: `
    background-color: rgb(245, 245, 245);
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
  `}})

  for (let i = 0; i < numberOfHour; i++) {
    hoursColumn.createDiv({ 
      text: `${i + startingHour}`, 
      cls: "hour", 
      attr: { style: `
        height: ${numberOfPixelForOneMinute * 60}px;
        display: flex;
        justify-content: center;
        color: grey;
        ${i === (numberOfHour - 1) ? "" : "border-bottom: 1px solid #b6b6b6;"}
      `} 
    })
    tasksColumn.createDiv({ 
      cls: "task",
      attr: { style: `
        height: ${numberOfPixelForOneMinute * 60}px;
        ${i === (numberOfHour - 1) ? "" : "border-bottom: 1px solid #b6b6b6;"}
      `} 
    })
  }

  return tasksColumn
}

