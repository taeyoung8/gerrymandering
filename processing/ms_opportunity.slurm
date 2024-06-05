#!/bin/bash

#SBATCH --job-name=op_ms
#SBATCH --output=op_ms.txt
#SBATCH --nodes=1
#SBATCH --time=240:00
#SBATCH -p short-96core
#SBATCH --mail-type=BEGIN,END
#SBATCH --mail-user=nicholas.logozzo@stonybrook.edu

# Load Required Modules
module load anaconda/3
conda create -y -n op_ms python=3.9
source activate op_ms
pip install geopandas pandas

# Run
cd /gpfs/projects/CSE416/Hornets
python3 opportunity.py MS

# Cleanup
conda deactivate
conda remove -y -n op_ms --all
