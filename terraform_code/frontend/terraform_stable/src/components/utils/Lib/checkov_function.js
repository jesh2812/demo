export async function Get_check(templatename,setSpinner) {
  setSpinner(true)
      setTimeout(() => {
        setSpinner(false);
      }, 10000);
    const response = await fetch('http://localhost:5000/api/checkov', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({
      templatename: templatename,
      })
    })
    console.log(templatename);
  

    response.blob().then((blob) => {
      let url = window.URL.createObjectURL(blob);
      console.log(url);
      let a = document.createElement("a");
      a.href = url;
      a.download = templatename + ".txt";
      a.click();
    });
  }