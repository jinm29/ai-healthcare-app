import {z} from "zod";

/**
 * HealthCheckup
 * - date, name are optional
 * - test_result is required (an inline object of all fields, each an optional object)
 */
export const HealthCheckupSchema = z.object({
    date: z.string().optional().nullable().describe("Examination date (yyyy-mm-dd)"),
    name: z.string().optional().nullable().describe("Name"),
    test_result: z
        .object({
            percent_saturation: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Percent Saturation (TSAT), iron saturation, transferrin saturation"),

            fev1: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("FEV1, Forced Expiratory Volume in 1 second, lung function parameter"),

            abo_blood_type: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("ABO Blood Type, ABO Group"),

            absolute_basophils: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Absolute Basophils, Basophil Count"),

            absolute_eosinophils: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Absolute Eosinophils, Eosinophil Count"),

            absolute_lymphocytes: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Absolute Lymphocytes, Lymphocyte Count"),

            alp: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("ALP, Alkaline Phosphatase"),

            absolute_monocytes: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Absolute Monocytes, Monocyte Count"),

            absolute_neutrophils: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Absolute Neutrophils, Neutrophil Count"),

            afp: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("AFP, Alpha-Fetoprotein"),

            albumin: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Albumin"),

            albumin_globulin_ratio: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Albumin/Globulin Ratio (A/G Ratio)"),

            albumin_urine: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urinary Albumin"),

            alt_sgpt: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("ALT (SGPT), Alanine Aminotransferase"),

            amylase: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Amylase, digestive enzyme"),

            ana_pattern: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("ANA Pattern (Antinuclear Antibody Pattern)"),

            ana_screen_ifa: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("ANA Screen IFA (Antinuclear Antibody Screen IFA)"),

            ana_titer: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("ANA Titer (Antinuclear Antibody Titer)"),

            apo_e_gene: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Apo E Gene (Apolipoprotein E Gene)"),

            apolipoprotein_a1: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Apolipoprotein A1 (Apo A1)"),

            apolipoprotein_b: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Apolipoprotein B (ApoB), Apolipoprotein B-100, Apolipoprotein B-48"),

            ast_sgot: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("AST (SGOT), Aspartate Aminotransferase"),

            hep_a_antibody_igm: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hepatitis A Antibody IgM (HAV IgM)"),

            hav_antibody: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hepatitis A Antibody Total (HAV Total Antibodies)"),

            basophils: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Basophils, Baso percentage"),

            total_bilirubin: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Total Bilirubin"),

            bone_density: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Bone Density, BMD"),

            bone_mineral_content_bmc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Bone Mineral Content (BMC)"),

            bun: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("BUN, Blood Urea Nitrogen"),

            bun_creatinine_ratio: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("BUN/Creatinine Ratio"),

            hep_b_c_antibody: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hepatitis B Core Antibody (HBcAb)"),

            hep_b_e_antigen: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hepatitis B e Antigen (HBeAg)"),

            hep_b_e_antibody: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hepatitis B e Antibody (HBeAb)"),

            hep_b_s_antigen: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hepatitis B Surface Antigen (HBsAg)"),

            hep_b_s_antibody: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hepatitis B Surface Antibody (HBsAb)"),

            ca125: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("CA125, Cancer Antigen 125"),

            ca153: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("CA15-3, Cancer Antigen 15-3"),

            ca19_9: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("CA19-9, Cancer Antigen 19-9"),

            calcitonin: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Calcitonin, thyroid hormone"),

            calcium: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Calcium level"),

            ldl_chol_calc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Calculated LDL Cholesterol (LDL Chol Calc)"),

            cea: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("CEA, Carcinoembryonic Antigen"),

            chol_hdlc_ratio: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Cholesterol/HDL-C Ratio, Total Cholesterol/HDL Ratio"),

            cholesterol_total: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Total Cholesterol"),

            cortisol: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Cortisol, stress hormone"),

            cortisol_am: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Cortisol AM, morning cortisol"),

            creatine_kinase: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Creatine Kinase (CK, CPK total)"),

            creatinine: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Creatinine, kidney function indicator"),

            cyfra_211: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("CYFRA 21-1, tumor marker"),

            cyfra_211_cytokeratin_19_fragment: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Cyfra 21-1 (Cytokeratin 19 fragment), tumor marker"),

            crp_c_reactive_protein: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("C-Reactive Protein (CRP), inflammation marker"),

            hep_c_antibody: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hepatitis C Antibody (Anti-HCV, HCV-Ab)"),

            dhea_sulfate: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("DHEA Sulfate (Dehydroepiandrosterone Sulfate)"),

            egfr: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("eGFR, Estimated Glomerular Filtration Rate"),

            eosinophils: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Eosinophils (Eos), white blood cell type"),

            estradiol: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Estradiol, female hormone"),

            fai_free_androgen_index: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Free Androgen Index (FAI)"),

            fat_fraction: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Fat Fraction, body fat percentage"),

            fat_tissue: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Fat Tissue, body fat"),

            ferritin: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Ferritin, iron storage protein"),

            fev1_fvc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("FEV1/FVC ratio, lung function"),

            fibrinogen: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Fibrinogen, blood clotting factor"),

            folate_rbc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Folate RBC (Red Blood Cell Folate)"),

            fraction_percent_small_dense_ldl: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Fraction % of Small Dense LDL"),

            free_t4_index_t7: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Free T4 Index (T7)"),

            fsh: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("FSH, Follicle Stimulating Hormone"),

            r_gtp: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("GGT, Gamma-GT, gamma-glutamyl transferase"),

            globulin: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Globulin, total globulin"),

            glucose: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Glucose, blood sugar"),

            hdl_cholesterol: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("HDL Cholesterol (High-Density Lipoprotein)"),

            hdl_large: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("HDL Large, large-sized HDL"),

            hematocrit: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hematocrit (HCT), red blood cell volume percentage"),

            hemoglobin: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hemoglobin (HGB)"),

            hemoglobin_a1c: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hemoglobin A1c (HbA1c), glycated hemoglobin"),

            hiv: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("HIV, Human Immunodeficiency Virus"),

            hiv_antibody: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("HIV Antibody, HIV-Ab (I+II)"),

            hav_igg: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hepatitis A Antibody IgG"),

            homocysteine: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Homocysteine, amino acid metabolite"),

            immature_granulocytes_abs: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Immature Granulocytes (Abs), absolute count"),

            insulin: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Insulin, blood insulin level"),

            iron: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Iron, blood iron level"),

            kl6_quantitative_test: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("KL-6 Quantitative Test, lung fibrosis marker"),

            ldl_cholesterol: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("LDL Cholesterol (Low-Density Lipoprotein)"),

            ldl_medium: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("LDL Medium, medium-sized LDL"),

            ldl_particle_number: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("LDL Particle Number (LDL-P)"),

            ldl_pattern: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("LDL Pattern"),

            ldl_peak_size: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("LDL Peak Size"),

            ldl_small: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("LDL Small, small LDL"),

            lead_venous: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Lead (venous), blood lead"),

            lean_tissue: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Lean Tissue, nonfat tissue mass"),

            leptin: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Leptin, appetite control hormone"),

            lh: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("LH, Luteinizing Hormone"),

            lipase: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Lipase, digestive enzyme"),

            lipid_panel: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Lipid Panel, Lipid Profile"),

            lipoprotein: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Lipoprotein, lipid transport protein"),

            lipoprotein_a: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Lipoprotein (a), Lp(a)"),

            liver_mrelastography: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Liver MR Elastography, liver fibrosis assessment"),

            low_density_ldl_subfraction: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Low Density LDL Subfraction"),

            lymphocytes: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Lymphocytes, percentage of lymphocytes"),

            m2bpgi: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe(
                    "M2BPGi, Mac-2 Binding Protein Glycosylation Isomer, liver fibrosis indicator"
                ),

            magnesium: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Magnesium, blood magnesium level"),

            magnesium_rbc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Magnesium RBC, red blood cell magnesium"),

            mastocheck: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("MASTOCHECK, breast cancer self-diagnosis test"),

            mch: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("MCH, Mean Corpuscular Hemoglobin"),

            mchc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("MCHC, Mean Corpuscular Hemoglobin Concentration"),

            mcv: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("MCV, Mean Corpuscular Volume"),

            mean_particle_size: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Mean Particle Size"),

            mercury_blood: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Mercury (blood), blood mercury level"),

            methylmalonic_acid: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Methylmalonic Acid, vitamin B12 deficiency marker"),

            monocytes: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Monocytes, percentage"),

            mpv: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("MPV, Mean Platelet Volume"),

            neutrophils: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Neutrophils, percentage"),

            nk_cell_activity: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("NK Cell Activity, natural killer cell activity"),

            non_hdl_cholesterol: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Non-HDL Cholesterol"),

            cardiac_risk_factor_nt_probnp: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("NT-proBNP, cardiac risk factor"),

            osteocalcin: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Osteocalcin, bone formation marker"),

            pepsinogen_i: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Pepsinogen I, gastric enzyme precursor"),

            pepsinogen_ii: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Pepsinogen II, gastric enzyme precursor"),

            pg_i_pg_ii_ratio: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Pepsinogen I/II ratio"),

            platelet_count: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Platelet Count"),

            pct: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("PCT, Plateletcrit"),

            potassium: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Potassium, blood potassium level"),

            pregnenolone: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Pregnenolone, steroid hormone precursor"),

            prolactin: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Prolactin, lactation hormone"),

            protein_total: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Total Protein"),

            psa_free: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Free PSA, Free Prostate-Specific Antigen"),

            ra_factor: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("RA factor, Rheumatoid Factor"),

            rbc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("RBC, Red Blood Cells count"),

            rdw: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("RDW, Red Cell Distribution Width"),

            resting_metabolic_rate_rmr: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Resting Metabolic Rate (RMR)"),

            rh_blood_type: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Rh Blood Type (positive/negative)"),

            rpr: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("RPR, Rapid Plasma Reagin Test (syphilis test)"),

            sd_ldl_cholesterol: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Small Dense LDL Cholesterol (sd LDL)"),

            selenium: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Selenium, antioxidant mineral"),

            shbg_sex_hormone_binding_globulin: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("SHBG, Sex Hormone-Binding Globulin"),

            sodium: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Sodium, blood sodium level"),

            free_t3: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Free T3, Free Triiodothyronine"),

            t3_uptake: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("T3 Uptake"),

            t4_total: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Total T4 (Thyroxine)"),

            free_t4: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Free T4 (Free Thyroxine)"),

            t4_free_direct: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Free T4 (Direct)"),

            testosterone: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Testosterone"),

            testosterone_free: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Free Testosterone"),

            testost_free_calc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Calculated Free Testosterone"),

            thyroglobulin_antibodies: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Thyroglobulin Antibodies"),

            thyroid_cascade_profile: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Thyroid Cascade Profile"),

            thyroid_peroxidase_antibodies: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Thyroid Peroxidase Antibodies (TPO Ab)"),

            total_body_fat_percent: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Total Body Fat %"),

            total_mass: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Total Mass"),

            tpla: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("TPLA, Treponema Pallidum Latex Agglutination (syphilis test)"),

            transferrin: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Transferrin, iron transport protein"),

            tsh: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("TSH, Thyroid Stimulating Hormone"),

            uibc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("UIBC, Unsaturated Iron Binding Capacity"),

            uric_acid: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Uric Acid"),

            vat_visceral_adipose_tissue: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("VAT, Visceral Adipose Tissue"),

            venipuncture: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Venipuncture, blood collection"),

            vitamin_b12: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Vitamin B12"),

            vitamin_d_25_hydroxy: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Vitamin D 25-Hydroxy, total Vitamin D"),

            vit_d2: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Vitamin D2 (Ergocalciferol)"),

            vit_d3: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Vitamin D3 (Cholecalciferol)"),

            vtd: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Vitamin D level"),

            wbc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("WBC, White Blood Cells count"),

            zinc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Zinc, blood zinc level"),

            indirect_bilirubin: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Indirect Bilirubin (unconjugated)"),

            thyroid_ultrasound: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Thyroid Ultrasound"),

            carotid_examination: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Carotid Examination, carotid ultrasound"),

            cervical_mri: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Cervical MRI"),

            cervical_xray: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Cervical X-ray"),

            cervical_ct: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Cervical CT"),

            hs_troponin_t: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("High-sensitivity Troponin T, cardiac damage marker"),

            bone_density_femur: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Bone Density Test (Femur)"),

            bone_density_spine: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Bone Density Test (Spine)"),

            gluten_immune_reaction: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Gluten Immune Reaction"),

            left_uncorrected_vision: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Left Uncorrected Vision"),

            right_uncorrected_vision: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Right Uncorrected Vision"),

            forced_vital_capacity_fvc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Forced Vital Capacity (FVC)"),

            brain_mri: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Brain MRI"),

            brain_ct: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Brain CT"),

            brain_vascular_ct: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Brain Vascular CT"),

            stool_occult_blood_test: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Stool Occult Blood Test"),

            stool_ova_test: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Stool Ova Test (parasite eggs)"),

            colonoscopic_examination: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Colonoscopic Examination"),

            colorectal_cancer_fecal_dna_test: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Colorectal Cancer Fecal DNA Test"),

            colon_biopsy: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Colon Biopsy"),

            arteriosclerosis_test: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Arteriosclerosis Test"),

            syphilis_test_tpla: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Syphilis Test (TPLA)"),

            syphilis_test_vdrl: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Syphilis Test (VDRL)"),

            pulse: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Pulse, heart rate"),

            abdominal_pelvic_ct: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Abdominal-Pelvic CT"),

            abdominal_mri: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Abdominal MRI"),

            abdominal_ultrasound: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Abdominal Ultrasound"),

            abdominal_ct: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Abdominal CT"),

            obesity: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Obesity rate"),

            folate_serum: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Serum Folate (Folic Acid)"),

            color_blindness: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Color Blindness test"),

            bacteria: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Bacteria, urine bacteria test"),

            systolic_blood_pressure: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Systolic Blood Pressure"),

            cystatin_c: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Cystatin C, kidney function indicator"),

            kidney: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Kidney"),

            renal_function_test_cr: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Renal Function Test (Creatinine)"),

            echocardiography: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Echocardiography, heart ultrasound"),

            ecg: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("ECG, Electrocardiogram"),

            left_fundus: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Fundus exam (Left)"),

            right_fundus: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Fundus exam (Right)"),

            fundus_exam: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Fundus examination"),

            chloride: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Chloride, blood chloride level"),

            oligomerized_amyloid_beta_test: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Oligomerized Amyloid Beta Test, Alzheimer's diagnostic test"),

            urine_protein: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine Protein"),

            urine_glucose: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine Glucose"),

            urine_bilirubin: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine Bilirubin"),

            urine_nitrites: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine Nitrites"),

            urobilinogen: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urobilinogen (urine)"),

            urine_occult_blood: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine Occult Blood"),

            lumbar_mri: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Lumbar MRI"),

            lumbar_xray: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Lumbar X-ray"),

            lumbar_ct: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Lumbar CT"),

            urine_ketones: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine Ketones"),

            right_corrected_vision: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Right Corrected Vision"),

            right_vision: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Right Vision"),

            right_intraocular_pressure: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Right Intraocular Pressure"),

            right_hearing_1000hz: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Right Hearing (1000Hz)"),

            right_hearing_2000hz: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Right Hearing (2000Hz)"),

            right_hearing_4000hz: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Right Hearing (4000Hz)"),

            right_hearing_500hz: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Right Hearing (500Hz)"),

            protozoa_test: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Protozoa Test, parasite test"),

            gastroscopy: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Gastroscopy, upper GI endoscopy"),

            double_contrast_gastrography: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Double Contrast Gastrography"),

            stomach_biopsy: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Stomach Biopsy"),

            lactate_dehydrogenase_ldh: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Lactate Dehydrogenase (LDH)"),

            diastolic_blood_pressure: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Diastolic Blood Pressure"),

            insulin_like_growth_factor_igf1: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Insulin-Like Growth Factor (IGF-1)"),

            psa_prostate_specific_antigen: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("PSA, Prostate-Specific Antigen"),

            prostate_ultrasound: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Prostate Ultrasound"),

            whole_body_mri: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Whole Body MRI"),

            left_corrected_vision: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Left Corrected Vision"),

            left_vision: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Left Vision"),

            left_intraocular_pressure: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Left Intraocular Pressure"),

            left_hearing_1000hz: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Left Hearing (1000Hz)"),

            left_hearing_2000hz: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Left Hearing (2000Hz)"),

            left_hearing_4000hz: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Left Hearing (4000Hz)"),

            left_hearing_500hz: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Left Hearing (500Hz)"),

            triglycerides: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Triglycerides"),

            direct_bilirubin: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Direct Bilirubin (conjugated)"),

            nitric_acid: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Nitric Acid, blood nitric acid"),

            hearing_right: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hearing (Right)"),

            hearing_left: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hearing (Left)"),

            weight: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Weight, body mass"),

            weight_control: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Weight Control"),

            bmi: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("BMI (Body Mass Index)"),

            carbon_dioxide: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Total Carbon Dioxide"),

            tibc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Total Iron Binding Capacity (TIBC)"),

            peak_expiratory_flow_pef: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Peak Expiratory Flow (PEF)"),

            cholinesterase: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Cholinesterase, enzyme test"),

            paraoxonase: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Paraoxonase, antioxidant enzyme"),

            standard_weight: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Standard Weight, ideal weight"),

            rubella_antigen_igm: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Rubella Antigen (IgM)"),

            rubella_antibody_igg: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Rubella Antibody (IgG)"),

            progastin_releasing_peptide_progrp: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Progastrin-Releasing Peptide (ProGRP), tumor marker"),

            anti_mullerian_hormone_amh: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Anti-Müllerian Hormone (AMH), fertility indicator"),

            antioxidant_capacity_tas: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Antioxidant Capacity (TAS)"),

            ana_antinuclear_antibodies_quant: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("ANA (Antinuclear Antibodies), Quantitative"),

            waist_circumference: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Waist Circumference"),

            hemoglobin_a1c_eag: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hemoglobin A1c-eAG, estimated average glucose (eAG)"),

            hemoglobin_a1c_ifcc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Hemoglobin A1c-IFCC"),

            platelet_percent: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Platelet Percentage"),

            pdw: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("PDW, Platelet Distribution Width"),

            esr: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Erythrocyte Sedimentation Rate (ESR)"),

            active_oxygen: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Active Oxygen, reactive oxygen species"),

            chest_xray: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Chest X-ray"),

            chest_xray_shooting: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Chest X-ray Shooting"),

            chest_ct: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Chest CT"),

            phosphorus: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Phosphorus, blood phosphorus level"),

            vldl_cholesterol_cal: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("VLDL Cholesterol (calculated)"),

            free_testosterone_direct: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Free Testosterone (Direct)"),

            bioavailable_testosterone: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Bioavailable Testosterone"),

            height: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Height"),

            predicted_vital_capacity: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Predicted Vital Capacity"),

            vital_capacity: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Vital Capacity"),

            percent_vital_capacity: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Percent Vital Capacity (%VC)"),

            urine_rbc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine RBC"),

            urine_wbc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine WBC"),

            urine_leukocytes: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine Leukocytes, leukocyte esterase"),

            urine_epi_cell: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine Epithelial Cells"),

            urine_specific_gravity: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine Specific Gravity (U.SG)"),

            urine_ph: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine pH"),

            skeletal_muscle_mass: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Skeletal Muscle Mass"),

            body_fat_mass: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Body Fat Mass"),

            h_pylori_igg: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Helicobacter pylori IgG"),

            urine_color: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine Color"),

            urine_turbidity: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine Turbidity"),

            psa_percent_free: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("PSA Percent Free"),

            ck_mb: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("CK-MB, Creatine Kinase-MB"),

            ionized_calcium: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Ionized Calcium"),

            microalbumin_creatinine_ratio: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Microalbumin/Creatinine Ratio"),

            creatinine_ru: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Random Urine Creatinine"),

            microalbumin_ru: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Random Urine Microalbumin"),

            blood_viscosity_scan_systolic: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Blood Viscosity Scan (Systolic)"),

            blood_viscosity_scan_diastolic: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Blood Viscosity Scan (Diastolic)"),

            progesterone: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Progesterone"),

            progesterone_seventeen: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("17 OH Progesterone"),

            band_neutrophils: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Band Neutrophils"),

            nucleated_rbc: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Nucleated RBC"),

            blast: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Blast Cells"),

            promyelocyte: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Promyelocyte"),

            myelocyte: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Myelocyte"),

            metamyelocyte: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Metamyelocyte"),

            urine_casts: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine Casts (cylindrical structures)"),

            urine_crystals: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine Crystals"),

            urine_nicotine: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Urine Nicotine"),

            cystatin_c_gfr: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Cystatin C GFR, estimated GFR using cystatin C"),

            hs_crp: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("High-Sensitivity C-Reactive Protein (hs-CRP)"),

            sedimentation_rate_westergren: z
                .object({
                    unit: z.string().optional().nullable().describe("Unit"),
                    value: z.string().optional().nullable().describe("Value"),
                })
                .optional().nullable()
                .describe("Sedimentation rate (Westergren method)"),
        })
        .describe("Test results"),
});

export type HealthCheckupType = z.infer<typeof HealthCheckupSchema>;
