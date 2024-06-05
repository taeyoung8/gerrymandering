#!/bin/bash

#SBATCH --job-name=bw_ny
#SBATCH --output=bw_ny.txt
#SBATCH --nodes=1
#SBATCH --time=480:00
#SBATCH -p long-96core
#SBATCH --mail-type=BEGIN,END
#SBATCH --mail-user=nicholas.logozzo@stonybrook.edu

# Load Required Modules
module load anaconda/3
conda create -y -n bw_ny python=3.9
source activate bw_ny
pip install geopandas pandas numpy

# Run
cd /gpfs/projects/CSE416/Hornets
python3 box_and_whisker.py NY

# Cleanup
conda deactivate
conda remove -y -n bw_ny --all
