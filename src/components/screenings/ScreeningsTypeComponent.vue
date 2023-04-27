<template>
    <div class="screenings-type">
      <div class="time-container">
        <div class="time-box">
          <span class="time">{{ time }}</span>
        </div>
        <p class="type">{{ type }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ScreeningsTypeComponent',
    props: {
      time: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
  <style>
  .screenings-type {
    display: flex;
  }
  
  .time-container {
    border-radius: 5px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .time-container:hover {
    background-color: #f0f0f033;
  }
  
  .time-container:active {
    transform: translateY(2px);
  }
  
  .time-box {
    background-image: linear-gradient(to bottom, #00D06C, #009846);
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 68px;
    height: 25px;
    box-shadow: 0 2px 4px rgba(0, 0, 1, 1);
  }
  
  .time {
    font-size: 15px;
    font-weight: normal;
    color: white;
    text-shadow: -1px 0 3px rgba(0, 0, 0, 0.308), 0 1px 3px rgba(0, 0, 0, 0.37), 1px 0 3px rgba(0, 0, 0, 0.377), 0 -1px 3px rgba(0, 0, 0, 0.438);
  }
  
  .type {
    margin-top: 5px;
    font-size: 12px;
    font-weight: 200;
  }
  </style>