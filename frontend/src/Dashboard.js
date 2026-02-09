import { useEffect, useState } from "react";

const [pageViews, setPageViews] = useState(0);

useEffect(() => {
  fetch("http://localhost:3000/api/stats")
    .then(res => res.json())
    .then(data => setPageViews(data.pageViews));
}, []);
