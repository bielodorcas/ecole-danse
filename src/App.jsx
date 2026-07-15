import { useState, useEffect } from "react";

function App() {
  const [page, setPage] = useState("dashboard");

  const [eleves, setEleves] = useState(() =>
    JSON.parse(localStorage.getItem("eleves") || "[]")
  );

  const [cours, setCours] = useState(() =>
    JSON.parse(localStorage.getItem("cours") || "[]")
  );

  const [inscriptions, setInscriptions] = useState(() =>
    JSON.parse(localStorage.getItem("inscriptions") || "[]")
  );

  const [absences, setAbsences] = useState(() =>
    JSON.parse(localStorage.getItem("absences") || "[]")
  );

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");

  const [nomCours, setNomCours] = useState("");
  const [professeur, setProfesseur] = useState("");
  const [jour, setJour] = useState("");
  const [heure, setHeure] = useState("");

  const [eleveSelectionne, setEleveSelectionne] = useState("");
  const [coursSelectionne, setCoursSelectionne] = useState("");

  const [eleveAbsent, setEleveAbsent] = useState("");
  const [coursAbsent, setCoursAbsent] = useState("");
  const [dateAbsence, setDateAbsence] = useState("");
  const [statutPresence, setStatutPresence] =
    useState("Présent");
  const [coursAppel, setCoursAppel] = useState("");
const [dateAppel, setDateAppel] = useState("");
const [eleveActif, setEleveActif] = useState(null);

const [rechercheEleve, setRechercheEleve] = useState("");

const [seances, setSeances] = useState(() =>
  JSON.parse(localStorage.getItem("seances") || "[]")
);


const [presenceSession, setPresenceSession] =
  useState({});
  


  useEffect(() => {
    localStorage.setItem(
      "eleves",
      JSON.stringify(eleves)
    );
  }, [eleves]);

  useEffect(() => {
    localStorage.setItem(
      "cours",
      JSON.stringify(cours)
    );
  }, [cours]);

  useEffect(() => {
    localStorage.setItem(
      "inscriptions",
      JSON.stringify(inscriptions)
    );
  }, [inscriptions]);

  useEffect(() => {
    localStorage.setItem(
      "absences",
      JSON.stringify(absences)
    );
  }, [absences]);

  useEffect(() => {
  localStorage.setItem(
    "seances",
    JSON.stringify(seances)
  );
}, [seances]);

  const ajouterEleve = () => {
    if (!nom || !prenom) return;

    setEleves([
      ...eleves,
      {
        id: Date.now(),
        nom,
        prenom,
        telephone,
        email,
      },
    ]);

    setNom("");
    setPrenom("");
    setTelephone("");
    setEmail("");
  };

  const supprimerEleve = (id) => {
    setEleves(eleves.filter((e) => e.id !== id));
  };

  const ajouterCours = () => {
    if (!nomCours) return;

    setCours([
      ...cours,
      {
        id: Date.now(),
        nom: nomCours,
        professeur,
        jour,
        heure,
      },
    ]);

    setNomCours("");
    setProfesseur("");
    setJour("");
    setHeure("");
  };

  const inscrireEleve = () => {
    if (!eleveSelectionne || !coursSelectionne)
      return;

    setInscriptions([
      ...inscriptions,
      {
        id: Date.now(),
        eleveId: eleveSelectionne,
        coursId: coursSelectionne,
      },
    ]);
  };

  const ajouterAbsence = () => {
    if (
      !eleveAbsent ||
      !coursAbsent ||
      !dateAbsence
    )
      return;

    setAbsences([
      ...absences,
      {
        id: Date.now(),
        eleveId: eleveAbsent,
        coursId: coursAbsent,
        date: dateAbsence,
        statut: statutPresence,
      },
    ]);

    setEleveAbsent("");
    setCoursAbsent("");
    setDateAbsence("");
    setStatutPresence("Présent");
  };

 
const elevesDuCours = inscriptions.filter(
  (i) =>
    String(i.coursId) ===
    String(coursAppel)
);

const enregistrerSeance = () => {
  if (!coursAppel || !dateAppel) {
    alert(
      "Veuillez sélectionner un cours et une date"
    );
    return;
  }

  const idSeance = Date.now();

  setSeances([
    ...seances,
    {
      id: idSeance,
      coursId: coursAppel,
      date: dateAppel,
    },
  ]);

  const nouvellesPresences = [...absences];

  elevesDuCours.forEach((i) => {
    nouvellesPresences.push({
      id: Date.now() + Math.random(),
      seanceId: idSeance,
      eleveId: i.eleveId,
      coursId: coursAppel,
      date: dateAppel,
      statut:
        presenceSession[i.eleveId] ||
        "Présent",
    });
  });

  setAbsences(nouvellesPresences);

  alert("Séance enregistrée");
};

const calculerTauxPresence = () => {
  if (!eleveActif) return 0;

  const presencesEleve = absences.filter(
    (a) =>
      String(a.eleveId) ===
      String(eleveActif.id)
  );

  if (presencesEleve.length === 0)
    return 0;

  const presents =
    presencesEleve.filter(
      (a) => a.statut === "Présent"
    ).length;

  return Math.round(
    (presents / presencesEleve.length) *
      100
  );
};

const elevesFiltres = eleves.filter((e) =>
  `${e.prenom} ${e.nom}`
    .toLowerCase()
    .includes(rechercheEleve.toLowerCase())
);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "auto",
        padding: "20px",
      }}
    >
      <h1>💃 École de Danse</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setPage("dashboard")}>
          🏠 Tableau de bord
        </button>

        <button onClick={() => setPage("eleves")}>
          👨‍🎓 Élèves
        </button>

        <button onClick={() => setPage("cours")}>
          💃 Cours
        </button>

        <button onClick={() => setPage("inscriptions")}>
          📝 Inscriptions
        </button>

        <button onClick={() => setPage("absences")}>
          📅 Présences
        </button>
        <button onClick={() => setPage("historique")}>
  📋 Historique
</button>
      </div>

      {page === "dashboard" && (
        <div>
          <h2>Tableau de bord</h2>

          <p>Élèves : {eleves.length}</p>
          <p>Cours : {cours.length}</p>
          <p>Inscriptions : {inscriptions.length}</p>
          <p>Présences : {absences.length}</p>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            🗑️ Réinitialiser les données
          </button>
        </div>
      )}

      {page === "eleves" && (
        <div>
          <h2>Gestion des élèves</h2>
          <input
  type="text"
  placeholder="🔍 Rechercher un élève"
  value={rechercheEleve}
  onChange={(e) =>
    setRechercheEleve(e.target.value)
  }
  style={{
    display: "block",
    marginBottom: "15px",
    width: "300px",
  }}
/>

          <input
            placeholder="Nom"
            value={nom}
            onChange={(e) =>
              setNom(e.target.value)
            }
          />

          <input
            placeholder="Prénom"
            value={prenom}
            onChange={(e) =>
              setPrenom(e.target.value)
            }
          />

          <input
            placeholder="Téléphone"
            value={telephone}
            onChange={(e) =>
              setTelephone(e.target.value)
            }
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <button onClick={ajouterEleve}>
            Ajouter
          </button>

          <ul>
            {elevesFiltres.map((e) => (
              <li key={e.id}>
                <button
  onClick={() => {
    setEleveActif(e);
    setPage("ficheEleve");
  }}
>
  {e.prenom} {e.nom}
</button>

                <button
                  onClick={() =>
                    supprimerEleve(e.id)
                  }
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {page === "cours" && (
        <div>
          <h2>Gestion des cours</h2>

          <input
            placeholder="Nom du cours"
            value={nomCours}
            onChange={(e) =>
              setNomCours(e.target.value)
            }
          />

          <input
            placeholder="Professeur"
            value={professeur}
            onChange={(e) =>
              setProfesseur(e.target.value)
            }
          />

          <input
            placeholder="Jour"
            value={jour}
            onChange={(e) =>
              setJour(e.target.value)
            }
          />

          <input
            type="time"
            value={heure}
            onChange={(e) =>
              setHeure(e.target.value)
            }
          />

          <button onClick={ajouterCours}>
            Ajouter
          </button>

          <ul>
            {cours.map((c) => (
              <li key={c.id}>
                {c.nom} - {c.professeur}
              </li>
            ))}
          </ul>
        </div>
      )}

      {page === "inscriptions" && (
        <div>
          <h2>Inscriptions</h2>

          <select
            value={eleveSelectionne}
            onChange={(e) =>
              setEleveSelectionne(e.target.value)
            }
          >
            <option value="">
              Choisir un élève
            </option>

            {eleves.map((e) => (
              <option key={e.id} value={e.id}>
                {e.prenom} {e.nom}
              </option>
            ))}
          </select>

          <select
            value={coursSelectionne}
            onChange={(e) =>
              setCoursSelectionne(e.target.value)
            }
          >
            <option value="">
              Choisir un cours
            </option>

            {cours.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>

          <button onClick={inscrireEleve}>
            Inscrire
          </button>

          <ul>
            {inscriptions.map((i) => {
              const eleve = eleves.find(
                (e) =>
                  String(e.id) ===
                  String(i.eleveId)
              );

              const coursTrouve =
                cours.find(
                  (c) =>
                    String(c.id) ===
                    String(i.coursId)
                );

              return (
                <li key={i.id}>
                  {eleve?.prenom} {eleve?.nom}
                  {" → "}
                  {coursTrouve?.nom}
                </li>
              );
            })}
          </ul>
        </div>
      )}
{page === "absences" && (
  <div>
    <h2>📅 Feuille d'appel</h2>

    <select
      value={coursAppel}
      onChange={(e) =>
        setCoursAppel(e.target.value)
      }
    >
      <option value="">
        Choisir un cours
      </option>

      {cours.map((c) => (
        <option key={c.id} value={c.id}>
          {c.nom}
        </option>
      ))}
    </select>

    <input
      type="date"
      value={dateAppel}
      onChange={(e) =>
        setDateAppel(e.target.value)
      }
    />

    <h3>Élèves inscrits</h3>

    {elevesDuCours.map((i) => {
      const eleve = eleves.find(
        (e) =>
          String(e.id) ===
          String(i.eleveId)
      );

      return (
        <div
          key={i.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "8px",
          }}
        >
          <strong>
            {eleve?.prenom} {eleve?.nom}
          </strong>

          <select
            value={
              presenceSession[i.eleveId] ||
              "Présent"
            }
            onChange={(e) =>
              setPresenceSession({
                ...presenceSession,
                [i.eleveId]:
                  e.target.value,
              })
            }
          >
            <option value="Présent">
              ✅ Présent
            </option>

            <option value="Excusé">
              🟡 Excusé
            </option>

            <option value="Absent">
              ❌ Absent
            </option>
          </select>
        </div>
      );
    })}

    {coursAppel && (
      <button
        onClick={enregistrerSeance}
        style={{
          marginTop: "15px",
          padding: "10px",
        }}
      >
        💾 Enregistrer la séance
      </button>
    )}

    <h3>Historique</h3>

    <ul>
      {absences.map((a) => {
        const eleve = eleves.find(
          (e) =>
            String(e.id) ===
            String(a.eleveId)
        );

        const coursTrouve =
          cours.find(
            (c) =>
              String(c.id) ===
              String(a.coursId)
          );

        return (
          <li key={a.id}>
            {eleve?.prenom} {eleve?.nom}
            {" - "}
            {coursTrouve?.nom}
            {" - "}
            {a.date}
            {" - "}
            {a.statut}
          </li>
        );
      })}
    </ul>
  </div>
)}
{page === "historique" && (
  <div>
    <h2>📋 Historique des séances</h2>

    {seances.map((s) => {
      const coursTrouve = cours.find(
        (c) =>
          String(c.id) === String(s.coursId)
      );

      const presencesSeance = absences.filter(
        (a) =>
          String(a.seanceId) === String(s.id)
      );

      return (
        <div
          key={s.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h3>{coursTrouve?.nom}</h3>

          <p>📅 {s.date}</p>

          <ul>
            {presencesSeance.map((p) => {
              const eleve = eleves.find(
                (e) =>
                  String(e.id) ===
                  String(p.eleveId)
              );

              return (
                <li key={p.id}>
                  {eleve?.prenom} {eleve?.nom}
                  {" - "}
                  {p.statut}
                </li>
              );
            })}
          </ul>
        </div>
      );
    })}
  </div>
)}
{page === "ficheEleve" && eleveActif && (
  <div>
    <h2>
      👤 {eleveActif.prenom} {eleveActif.nom}
    </h2>

    <button
      onClick={() => setPage("eleves")}
    >
      ← Retour
    </button>

    <h3>Cours suivis</h3>

    <ul>
      {inscriptions
        .filter(
          (i) =>
            String(i.eleveId) ===
            String(eleveActif.id)
        )
        .map((i) => {
          const coursTrouve = cours.find(
            (c) =>
              String(c.id) ===
              String(i.coursId)
          );

          return (
            <li key={i.id}>
              ✅ {coursTrouve?.nom}
            </li>
          );
        })}
    </ul>

    <h3>Historique des présences</h3>
    <h3>
  Taux de présence :
  {" "}
  {calculerTauxPresence()} %
</h3>

    <ul>
      {absences
        .filter(
          (a) =>
            String(a.eleveId) ===
            String(eleveActif.id)
        )
        .map((a) => {
          const coursTrouve = cours.find(
            (c) =>
              String(c.id) ===
              String(a.coursId)
          );

          return (
            <li key={a.id}>
              {a.date}
              {" - "}
              {coursTrouve?.nom}
              {" - "}
              {a.statut}
            </li>
          );
        })}
    </ul>
  </div>
)}

 </div>
  );
}

export default App;