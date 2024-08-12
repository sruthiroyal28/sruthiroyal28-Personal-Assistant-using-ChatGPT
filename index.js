const openai=process.env.OPENAI_API_KEY;
const url="https://api.openai.com/v1/completions";
document.getElementById("send-btn").addEventListener("click",function getTaskpairs(){
    const textareas = document.getElementsByTagName('textarea');
    const taskPairs = {};

    for(let i=0 ; i<textareas.length-1;i+=2)
    {
        const timeTextArea = textareas[i];
        const taskTextArea = textareas[i+1];
        if(timeTextArea && taskTextArea)
        {
            const timeValue = timeTextArea.value.trim();
            const taskValue = taskTextArea.value.trim();
            if (timeValue && taskValue) { // Check if both timeValue and taskValue are not empty
                taskPairs[timeValue] = taskValue;
                console.log('Task Pairs:',taskPairs);
            } 
            //else part
        }
    }
    //to check if code is wprking we can print them in console
   

    const todoTextArea = document.getElementById('wishlist');
    const todoTasks = todoTextArea.value.split('\n').filter((task)=> task.trim()!=="");
    console.log('Todo tasks',todoTasks);


    getCopySuggestion(taskPairs,todoTasks);
})
async function getCopySuggestion(taskPairs,todoTasks) {
    //var prompt = $('#setup-textarea').val();
    prompt += "\nTasks to be scheduled:\n";

    for (const [timePeriod, task] of Object.entries(taskPairs)) {
        if (timePeriod) {
            prompt += `${timePeriod} - ${task}\n`;
        } 
    }

    for(const task of todoTasks)
    {
        prompt+=`     ${task}\n`;
    } 

    console.log(prompt);
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + openai
        },
        body: JSON.stringify({
            'model': 'text-davinci-003',
            //'prompt': prompt, // Use the updated prompt here
            'prompt':"Generate time table for 24 hours for the given tasks in given time period , if specific time period is not mentioned   based on temporal reference given assign task to specific time line with maximum of one hour"+prompt+"And generate a motivational message to follow the tasks ",
            'max_tokens': 500,
            'temperature':0.7,
        })

    }).then((response) => response.json()).then(data => {
        console.log(data.choices[0].text);
        setTimeout(function(){
        document.getElementById("speech-bubble-output").innerText=data.choices[0].text.trim();

        },1000)
    }).catch(error => {
        console.error(error);
        alert('An error occurred while generating the copy. Please try again.');
    });
}


