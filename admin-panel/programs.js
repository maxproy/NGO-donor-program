let programsList = [];

// Load and Render Programs
async function renderPrograms() {
    try {
        const response = await fetch('../api/programs/list.php', { 
            credentials: 'include',
            cache: 'no-store' // Force live data refresh!
        });
        const result = await response.json();
        
        const table = document.getElementById("programTable");
        if (!table) return;
        
        table.innerHTML = "";

        if (result.success && result.data && result.data.length > 0) {
            programsList = result.data;
            
            programsList.forEach(prog => {
                const target = parseFloat(prog.target_amount);
                const current = parseFloat(prog.current_amount);
                const remaining = parseFloat(prog.remaining_amount);
                
                // Calculate progress percentage for the bar
                let progress = 0;
                if (target > 0) {
                    progress = Math.min(100, (current / target) * 100).toFixed(1);
                }
                
                table.innerHTML += `
                  <tr>
                    <td><strong>${prog.name}</strong><br><small style="color:#666;">${prog.country || 'Global'}</small></td>
                    <td>$${target.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td>
                        $${current.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${progress}%)
                        <div style="background-color: #e0e0e0; border-radius: 4px; width: 100%; height: 8px; margin-top: 5px;">
                            <div style="background-color: #1f7a4c; height: 100%; border-radius: 4px; width: ${progress}%;"></div>
                        </div>
                    </td>
                    <td>$${remaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td>
                        <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; background-color: ${prog.status === 'active' ? '#e6f4ea' : '#ffebee'}; color: ${prog.status === 'active' ? '#1f7a4c' : '#c62828'}; text-transform: capitalize;">
                            ${prog.status}
                        </span>
                    </td>
                     <td>
                        <button class="action-btn edit-btn" onclick="editProgram(${prog.program_id})">Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteProgram(${prog.program_id})">Delete</button>
                    </td>               
                   </tr>
                `;
            });
        } else {
            table.innerHTML = "<tr><td colspan='6' style='text-align: center; padding: 20px;'>No programs found</td></tr>";        }
          } catch (error) {
              console.error("Error fetching programs:", error);
              const table = document.getElementById("programTable");
  if (table) table.innerHTML = "<tr><td colspan='6' style='text-align: center; color: red;'>Failed to load data</td></tr>";    }
}

// Add New Program
const programForm = document.getElementById("programForm");
if (programForm) {
    programForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const id = document.getElementById("programId").value;
        const formData = new FormData();
        formData.append('name', document.getElementById("programName").value);
        formData.append('description', document.getElementById("programDesc").value);
        formData.append('target_amount', document.getElementById("targetAmount").value);
        formData.append('country', document.getElementById("programCountry").value);
        if (document.getElementById("programStatus")) {
           formData.append('status', document.getElementById("programStatus").value);
        }
        try {
             let url = '../api/programs/create.php';
            if (id !== "") {
                url = '../api/programs/update.php';
                formData.append('program_id', id);
            }

            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const result = await response.json();

            if (result.success) {
                renderPrograms();
                this.reset();
                document.getElementById("programId").value = "";
                document.querySelector('.form-container h3').textContent = 'Launch New Program';
                alert("Program saved successfully!");
            } else {
                alert("Error: " + (result.message || "Something went wrong"));
            }
        } catch (error) {
            console.error("Error saving program:", error);
            alert("An error occurred while saving the program.");
        }
    });
}

// Edit Program
function editProgram(id) {
    const prog = programsList.find(p => p.program_id == id);
    if (prog) {
        document.getElementById("programId").value = prog.program_id;
        document.getElementById("programName").value = prog.name;
        document.getElementById("targetAmount").value = prog.target_amount;
        document.getElementById("programCountry").value = prog.country || '';
        document.getElementById("programDesc").value = prog.description || '';
        if (document.getElementById("programStatus")) {
            document.getElementById("programStatus").value = prog.status || 'active';
        }
        
        document.querySelector('.form-container h3').textContent = 'Edit Program';
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    }
}

// Delete Program
async function deleteProgram(id) {
    if (confirm("Are you sure you want to delete this program? (Existing donations will remain, but the goal tracker will be removed.)")) {
        try {
            const formData = new FormData();
            formData.append('program_id', id);

            const response = await fetch('../api/programs/delete.php', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const result = await response.json();

            if (result.success) {
                renderPrograms();
            } else {
                alert("Error deleting program: " + (result.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Error deleting program:", error);
        }
    }
}

// Load on page start
document.addEventListener('DOMContentLoaded', renderPrograms);