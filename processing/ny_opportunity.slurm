#!/bin/bash

#SBATCH --job-name=op_ny
#SBATCH --output=op_ny.txt
#SBATCH --nodes=1
#SBATCH --time=480:00
#SBATCH -p long-96core
#SBATCH --mail-type=BEGIN,END
#SBATCH --mail-user=nicholas.logozzo@stonybrook.edu

# Load Required Modules
module load anaconda/3
conda create -y -n op_ny python=3.9
source activate op_ny
pip install geopandas pandas

# Run
cd /gpfs/projects/CSE416/Hornets
python3 opportunity.py NY

# Cleanup
conda deactivate
conda remove -y -n op_ny --all
