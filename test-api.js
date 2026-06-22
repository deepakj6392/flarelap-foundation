async function testFetch() {
  try {
    const res = await fetch('http://localhost:3000/api/courses');
    const data = await res.json();
    console.log('API returned courses:', data.courses.length);
    data.courses.forEach(c => console.log(`- ${c.name}`));
  } catch (err) {
    console.error(err);
  }
}

testFetch();
