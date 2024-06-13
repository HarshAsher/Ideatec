import random
import string

from django.shortcuts import render
from django.views.decorators.clickjacking import xframe_options_exempt


@xframe_options_exempt
def dashboard(request, sub_id="", per_page=""):
    user_name = "DJBuser" + ''.join(random.choices(string.ascii_letters, k=10)) + "_" + str(sub_id)
    return render(request, 'DJBFiltration/templates/dashboard.html', {'per_page': str(per_page), 'sub_id': str(sub_id), 'user_name': user_name})

