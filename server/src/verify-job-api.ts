
const API_URL = 'http://localhost:3000';
const TEST_USER = {
  email: `test_verify_${Date.now()}@example.com`,
  password: 'password123',
  name: 'Test Verify'
};

const verifyApi = async () => {
  try {
    console.log('1. Registering User...');
    let res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_USER)
    });
    if (!res.ok) throw new Error(`Register failed: ${res.statusText}`);
    const user = await res.json();
    console.log('   User Registered:', user.id);

    console.log('2. Logging In...');
    res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: TEST_USER.email, password: TEST_USER.password })
    });
    if (!res.ok) throw new Error(`Login failed: ${res.statusText}`);
    const loginData = await res.json();
    const token = loginData.token;
    console.log('   Logged In. Token received.');

    const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    console.log('3. Creating Job...');
    const jobData = {
      companyName: 'Tech Corp',
      role: 'Frontend Developer',
      appliedFrom: 'LinkedIn',
      appliedDate: new Date().toISOString(),
      status: 'Applied',
      description: 'React role',
    };
    res = await fetch(`${API_URL}/api/jobs`, {
        method: 'POST',
        headers,
        body: JSON.stringify(jobData)
    });
    if (!res.ok) throw new Error(`Create Job failed: ${res.statusText}`);
    const job = await res.json();
    const jobId = job.id;
    console.log('   Job Created:', jobId);

    console.log('4. Listing Jobs...');
    res = await fetch(`${API_URL}/api/jobs`, { headers });
    if (!res.ok) throw new Error(`List Jobs failed: ${res.statusText}`);
    const jobs = await res.json();
    console.log('   Jobs Found:', jobs.length);
    if (jobs.length === 0) throw new Error('No jobs found!');

    console.log('5. Updating Job...');
    res = await fetch(`${API_URL}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: 'Interviewing' })
    });
    if (!res.ok) throw new Error(`Update Job failed: ${res.statusText}`);
    console.log('   Job Updated.');

    console.log('6. Verifying Update...');
    res = await fetch(`${API_URL}/api/jobs/${jobId}`, { headers });
    if (!res.ok) throw new Error(`Get Job failed: ${res.statusText}`);
    const updatedJob = await res.json();
    if (updatedJob.status !== 'Interviewing') throw new Error('Update failed!');
    console.log('   Job Status Verified:', updatedJob.status);

    console.log('7. Deleting Job...');
    res = await fetch(`${API_URL}/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers
    });
    if (!res.ok && res.status !== 204) throw new Error(`Delete Job failed: ${res.statusText}`);
    console.log('   Job Deleted.');

    console.log('✅ verification SUCCESSFUL');
  } catch (error: any) {
    console.error('❌ Verification FAILED:', error.message);
    process.exit(1);
  }
};

verifyApi();
